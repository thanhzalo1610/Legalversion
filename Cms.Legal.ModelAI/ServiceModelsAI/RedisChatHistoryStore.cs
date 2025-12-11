using Cms.Legal.ModelAI.ServiceModelsAI.ChatHistoryCleanupService;
using LLama.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System.Text.Json;

namespace Cms.Legal.ModelAI.ServiceModelsAI
{

    /// <summary>
    /// Redis-based chat history storage
    /// Good for: Production, multi-server deployments, high scalability
    /// Supports distributed systems with shared state
    /// </summary>
    public class RedisChatHistoryStore : IChatHistoryStore
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IDatabase _db;
        private readonly ILogger<RedisChatHistoryStore>? _logger;
        private readonly string _keyPrefix;
        private readonly TimeSpan _defaultExpiry;

        public RedisChatHistoryStore(
            IConnectionMultiplexer redis,
            IConfiguration configuration,
            ILogger<RedisChatHistoryStore>? logger = null)
        {
            _redis = redis;
            _db = redis.GetDatabase();
            _logger = logger;
            _keyPrefix = configuration["AiSettings:RedisKeyPrefix"] ?? "chat:history:";

            var expiryHours = configuration.GetValue<int>("AiSettings:SessionExpiryHours", 24);
            _defaultExpiry = TimeSpan.FromHours(expiryHours);

            _logger?.LogInformation("Redis chat history store initialized. Key prefix: {Prefix}, Expiry: {Hours}h",
                _keyPrefix, expiryHours);
        }

        public async Task<ChatHistory> LoadHistoryAsync(string sessionId)
        {
            var key = GetRedisKey(sessionId);

            try
            {
                var json = await _db.StringGetAsync(key);

                if (json.IsNullOrEmpty)
                {
                    _logger?.LogDebug("No history found in Redis for session: {SessionId}", sessionId);
                    return new ChatHistory();
                }

                var dto = JsonSerializer.Deserialize<ChatHistoryDto>(json!);

                if (dto == null)
                {
                    _logger?.LogWarning("Failed to deserialize Redis history for session: {SessionId}", sessionId);
                    return new ChatHistory();
                }

                var history = new ChatHistory();
                foreach (var msg in dto.Messages)
                {
                    history.AddMessage(msg.Role, msg.Content);
                }

                // Extend TTL on access (sliding expiration)
                await _db.KeyExpireAsync(key, _defaultExpiry);

                _logger?.LogDebug("Loaded {Count} messages from Redis for session: {SessionId}",
                    dto.Messages.Count, sessionId);

                return history;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error loading history from Redis for session: {SessionId}", sessionId);
                return new ChatHistory();
            }
        }

        public async Task SaveHistoryAsync(string sessionId, ChatHistory history, bool isVipUser = false)
        {
            var key = GetRedisKey(sessionId);

            try
            {
                // Check if session exists to preserve CreatedAt
                var existingJson = await _db.StringGetAsync(key);
                var createdAt = DateTime.UtcNow;

                if (!existingJson.IsNullOrEmpty)
                {
                    var existing = JsonSerializer.Deserialize<ChatHistoryDto>(existingJson!);
                    if (existing != null)
                    {
                        createdAt = existing.CreatedAt;
                    }
                }

                var dto = new ChatHistoryDto
                {
                    SessionId = sessionId,
                    IsVipUser = isVipUser,
                    CreatedAt = createdAt,
                    UpdatedAt = DateTime.UtcNow,
                    Messages = history.Messages.Select(m => new MessageDto
                    {
                        Role = m.AuthorRole,
                        Content = m.Content
                    }).ToList()
                };

                var json = JsonSerializer.Serialize(dto);

                // Use longer expiry for VIP users
                var expiry = isVipUser ? _defaultExpiry * 2 : _defaultExpiry;

                await _db.StringSetAsync(key, json, expiry);

                _logger?.LogDebug("Saved {Count} messages to Redis for session: {SessionId}, Expiry: {Hours}h",
                    dto.Messages.Count, sessionId, expiry.TotalHours);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error saving history to Redis for session: {SessionId}", sessionId);
                throw;
            }
        }

        public async Task DeleteHistoryAsync(string sessionId)
        {
            var key = GetRedisKey(sessionId);

            try
            {
                var deleted = await _db.KeyDeleteAsync(key);

                if (deleted)
                {
                    _logger?.LogInformation("Deleted history from Redis for session: {SessionId}", sessionId);
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error deleting history from Redis for session: {SessionId}", sessionId);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(string sessionId)
        {
            var key = GetRedisKey(sessionId);
            return await _db.KeyExistsAsync(key);
        }

        public async Task<IEnumerable<string>> GetActiveSessionsAsync()
        {
            try
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var pattern = $"{_keyPrefix}*";
                var keys = server.Keys(pattern: pattern);

                var sessionIds = keys
                    .Select(k => k.ToString().Replace(_keyPrefix, ""))
                    .ToList();

                return sessionIds;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error getting active sessions from Redis");
                return Enumerable.Empty<string>();
            }
        }

        public async Task CleanupOldSessionsAsync(TimeSpan olderThan)
        {
            // Redis handles expiry automatically via TTL
            // This method is for manual cleanup if needed

            try
            {
                var cutoffTime = DateTime.UtcNow - olderThan;
                var sessions = await GetActiveSessionsAsync();
                var deletedCount = 0;

                foreach (var sessionId in sessions)
                {
                    var key = GetRedisKey(sessionId);
                    var json = await _db.StringGetAsync(key);

                    if (!json.IsNullOrEmpty)
                    {
                        var dto = JsonSerializer.Deserialize<ChatHistoryDto>(json!);
                        if (dto != null && dto.UpdatedAt < cutoffTime)
                        {
                            await _db.KeyDeleteAsync(key);
                            deletedCount++;
                        }
                    }
                }

                if (deletedCount > 0)
                {
                    _logger?.LogInformation("Manually cleaned up {Count} old sessions from Redis (older than {TimeSpan})",
                        deletedCount, olderThan);
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error during Redis cleanup");
            }
        }

        private string GetRedisKey(string sessionId)
        {
            return $"{_keyPrefix}{sessionId}";
        }
    }

    // Shared DTOs (same as FileChatHistoryStore)
    public class ChatHistoryDto
    {
        public string SessionId { get; set; } = string.Empty;
        public bool IsVipUser { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<MessageDto> Messages { get; set; } = new();
    }

    public class MessageDto
    {
        public AuthorRole Role { get; set; }
        public string Content { get; set; } = string.Empty;
    }

}