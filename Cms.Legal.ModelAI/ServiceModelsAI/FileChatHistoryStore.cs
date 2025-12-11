using LLama.Common;
using System.Text.Json;
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Cms.Legal.ModelAI.ServiceModelsAI.ChatHistoryCleanupService;
namespace Cms.Legal.ModelAI.ServiceModelsAI.FileChatHistoryStore
{

    /// <summary>
    /// File-based chat history storage
    /// Good for: Development, small deployments, single-server setups
    /// Each session = 1 JSON file
    /// </summary>
    public class FileChatHistoryStore : IChatHistoryStore
    {
        private readonly string _storageDirectory;
        private readonly ILogger<FileChatHistoryStore>? _logger;
        private readonly SemaphoreSlim _fileLock = new SemaphoreSlim(1, 1);
        private readonly ConcurrentDictionary<string, SemaphoreSlim> _sessionLocks = new();

        public FileChatHistoryStore(IConfiguration configuration, ILogger<FileChatHistoryStore>? logger = null)
        {
            _storageDirectory = configuration["AiSettings:ChatHistoryPath"] ?? "chat_history";
            _logger = logger;

            // Create directory if not exists
            if (!Directory.Exists(_storageDirectory))
            {
                Directory.CreateDirectory(_storageDirectory);
                _logger?.LogInformation("Created chat history directory: {Path}", _storageDirectory);
            }
        }

        public async Task<ChatHistory> LoadHistoryAsync(string sessionId)
        {
            var filePath = GetFilePath(sessionId);

            if (!File.Exists(filePath))
            {
                _logger?.LogDebug("No history found for session: {SessionId}", sessionId);
                return new ChatHistory();
            }

            var sessionLock = _sessionLocks.GetOrAdd(sessionId, _ => new SemaphoreSlim(1, 1));
            await sessionLock.WaitAsync();
            try
            {
                var json = await File.ReadAllTextAsync(filePath);
                var dto = JsonSerializer.Deserialize<ChatHistoryDto>(json);

                if (dto == null)
                {
                    _logger?.LogWarning("Failed to deserialize history for session: {SessionId}", sessionId);
                    return new ChatHistory();
                }

                var history = new ChatHistory();
                foreach (var msg in dto.Messages)
                {
                    history.AddMessage(msg.Role, msg.Content);
                }

                _logger?.LogDebug("Loaded {Count} messages for session: {SessionId}", dto.Messages.Count, sessionId);
                return history;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error loading history for session: {SessionId}", sessionId);
                return new ChatHistory();
            }
            finally
            {
                sessionLock.Release();
            }
        }

        public async Task SaveHistoryAsync(string sessionId, ChatHistory history, bool isVipUser = false)
        {
            var filePath = GetFilePath(sessionId);

            var dto = new ChatHistoryDto
            {
                SessionId = sessionId,
                IsVipUser = isVipUser,
                CreatedAt = File.Exists(filePath)
                    ? File.GetCreationTimeUtc(filePath)
                    : DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Messages = history.Messages.Select(m => new MessageDto
                {
                    Role = m.AuthorRole,
                    Content = m.Content
                }).ToList()
            };

            var sessionLock = _sessionLocks.GetOrAdd(sessionId, _ => new SemaphoreSlim(1, 1));
            await sessionLock.WaitAsync();
            try
            {
                var json = JsonSerializer.Serialize(dto, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                await File.WriteAllTextAsync(filePath, json);

                _logger?.LogDebug("Saved {Count} messages for session: {SessionId}", dto.Messages.Count, sessionId);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error saving history for session: {SessionId}", sessionId);
                throw;
            }
            finally
            {
                sessionLock.Release();
            }
        }

        public async Task DeleteHistoryAsync(string sessionId)
        {
            var filePath = GetFilePath(sessionId);

            if (File.Exists(filePath))
            {
                var sessionLock = _sessionLocks.GetOrAdd(sessionId, _ => new SemaphoreSlim(1, 1));
                await sessionLock.WaitAsync();
                try
                {
                    File.Delete(filePath);
                    _logger?.LogInformation("Deleted history for session: {SessionId}", sessionId);
                }
                finally
                {
                    sessionLock.Release();
                    _sessionLocks.TryRemove(sessionId, out _);
                }
            }
        }

        public Task<bool> ExistsAsync(string sessionId)
        {
            var filePath = GetFilePath(sessionId);
            return Task.FromResult(File.Exists(filePath));
        }

        public Task<IEnumerable<string>> GetActiveSessionsAsync()
        {
            var files = Directory.GetFiles(_storageDirectory, "*.json");
            var sessionIds = files.Select(f => Path.GetFileNameWithoutExtension(f));
            return Task.FromResult(sessionIds);
        }

        public async Task CleanupOldSessionsAsync(TimeSpan olderThan)
        {
            var cutoffTime = DateTime.UtcNow - olderThan;
            var files = Directory.GetFiles(_storageDirectory, "*.json");
            var deletedCount = 0;

            foreach (var file in files)
            {
                try
                {
                    var lastModified = File.GetLastWriteTimeUtc(file);
                    if (lastModified < cutoffTime)
                    {
                        File.Delete(file);
                        deletedCount++;

                        var sessionId = Path.GetFileNameWithoutExtension(file);
                        _sessionLocks.TryRemove(sessionId, out _);
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, "Error deleting old session file: {File}", file);
                }
            }

            if (deletedCount > 0)
            {
                _logger?.LogInformation("Cleaned up {Count} old sessions (older than {TimeSpan})",
                    deletedCount, olderThan);
            }
        }

        private string GetFilePath(string sessionId)
        {
            // Sanitize session ID to prevent path traversal
            var safeSessionId = string.Join("_", sessionId.Split(Path.GetInvalidFileNameChars()));
            return Path.Combine(_storageDirectory, $"{safeSessionId}.json");
        }
    }

    // DTOs for serialization
    public class ChatHistoryDto
    {
        public string SessionId { get; set; } = string.Empty;
        public bool IsVipUser { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<MessageDto> Messages { get; set; } = new();
    }

    public  class MessageDto
    {
        public AuthorRole Role { get; set; }
        public string Content { get; set; } = string.Empty;
    }

}