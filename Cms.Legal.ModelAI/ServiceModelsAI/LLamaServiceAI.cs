using LLama;
using LLama.Common;
using LLama.Sampling;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Text;

namespace Cms.Legal.ModelAI.ServiceModelsAI
{
    public class LLamaServiceAI : IDisposable
    {
        private readonly LLamaWeights _model;
        private readonly ModelParams _parameters;
        private readonly ConcurrentDictionary<string, SessionWrapper> _activeSessions;
        private readonly SemaphoreSlim _inferenceSemaphore;
        private readonly IConfiguration _configuration;
        private readonly ILogger<LLamaServiceAI>? _logger;
        private readonly Timer _cleanupTimer;
        private readonly int _maxConcurrentInference;
        private readonly int _sessionTimeoutMinutes;
        private readonly int _maxSessions;


        private class SessionWrapper
        {
            public ChatSession Session { get; set; }
            public DateTime LastAccessed { get; set; }
            public SemaphoreSlim Lock { get; set; } = new SemaphoreSlim(1, 1);

            public SessionWrapper(ChatSession session)
            {
                Session = session;
                LastAccessed = DateTime.UtcNow;
            }
        }
        // Constructor này sẽ CHỈ CHẠY 1 LẦN DUY NHẤT
        public LLamaServiceAI(IConfiguration configuration, ILogger<LLamaServiceAI>? logger = null)
        {
            _configuration = configuration;
            _logger = logger;

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(">>> [DEV MODE] Starting model load... (this may take a few minutes)");

            string modelPath = configuration["AiSettings:ModelPath"]
                ?? throw new ArgumentNullException("AiSettings:ModelPath not configured");

            if (!File.Exists(modelPath))
                throw new FileNotFoundException($"Model not found at: {modelPath}");

            // Read configuration
            var contextSize = configuration.GetValue<uint>("AiSettings:ContextSize", 5120);
            var gpuLayers = configuration.GetValue<int>("AiSettings:GpuLayerCount", 0);
            _maxConcurrentInference = configuration.GetValue<int>("AiSettings:MaxConcurrentInference", 5);
            _sessionTimeoutMinutes = configuration.GetValue<int>("AiSettings:SessionTimeoutMinutes", 30);
            _maxSessions = configuration.GetValue<int>("AiSettings:MaxSessions", 100);

            _parameters = new ModelParams(modelPath)
            {
                ContextSize = contextSize,
                GpuLayerCount = gpuLayers,
                SeqMax = 42,
                MainGpu = 0,
                Threads = (int?)((uint?)Environment.ProcessorCount / 2),
                BatchSize=256,
                BatchThreads=6,
                UseMemorymap = true,
                UseMemoryLock = false,
                UBatchSize=256,
                
            };

            _logger?.LogInformation("Loading model with ContextSize={ContextSize}, GPU={GpuLayers}",
                contextSize, gpuLayers);

            _model = LLamaWeights.LoadFromFile(_parameters);
            _activeSessions = new ConcurrentDictionary<string, SessionWrapper>();
            _inferenceSemaphore = new SemaphoreSlim(_maxConcurrentInference, _maxConcurrentInference);

            // Cleanup timer - runs every 5 minutes

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(">>> MODEL LOADED! Ready to serve.");
            Console.ResetColor();

            _logger?.LogInformation("LLaMA model loaded successfully. Max sessions: {MaxSessions}", _maxSessions);
        
        }

        public async Task<StringBuilder> ChatAsync(string sessionId, string message, bool isVipUser = false)
        {
            if (string.IsNullOrWhiteSpace(message))
                throw new ArgumentException("Message cannot be empty", nameof(message));

            // Check session limit for non-VIP users
            if (!isVipUser && _activeSessions.Count >= _maxSessions)
            {
                throw new InvalidOperationException(
                    $"Maximum session limit reached ({_maxSessions}). Please upgrade to VIP for unlimited sessions.");
            }

            await _inferenceSemaphore.WaitAsync();
            try
            {
                var wrapper = _activeSessions.GetOrAdd(sessionId, key => CreateNewSession());

                await wrapper.Lock.WaitAsync();
                try
                {
                    wrapper.LastAccessed = DateTime.UtcNow;

                    var inferenceParams = CreateInferenceParams(isVipUser);
                    var response = new StringBuilder();

                    await foreach (var text in wrapper.Session.ChatAsync(
                        new ChatHistory.Message(AuthorRole.User, message),
                        inferenceParams))
                    {
                        response.Append(text);
                    }

                    _logger?.LogDebug("Chat completed for session {SessionId}. Response length: {Length}",
                        sessionId, response.Length);

                    return response;
                }
                finally
                {
                    wrapper.Lock.Release();
                }
            }
            finally
            {
                _inferenceSemaphore.Release();
            }
        }
        /// <summary>
        /// Backward compatibility method
        /// </summary>
        public Task<StringBuilder> ChatTest(string sessionId, string message)
        {
            return ChatAsync(sessionId, message, isVipUser: false);
        }

        private SessionWrapper CreateNewSession()
        {
            var context = _model.CreateContext(_parameters);
            var executor = new InteractiveExecutor(context);
            var chatHistory = new ChatHistory();

            // Add system prompt
            var systemPrompt = GetSystemPrompt();
            chatHistory.AddMessage(AuthorRole.System, "You are a Legal Law Library AI. When users ask anything about law (labor, contract, employment, civil, corporate, etc.), you answer by providing legal information only: definitions, rules, statutes, principles. Answer directly to the question, stay factual, clear, and neutral.");

            var session = new ChatSession(executor, chatHistory);

            _logger?.LogDebug("Created new chat session");

            return new SessionWrapper(session);
        }

        private InferenceParams CreateInferenceParams(bool isVipUser)
        {
            var maxTokens = isVipUser
                ? _configuration.GetValue<int>("AiSettings:VipMaxTokens", 4096)
                : _configuration.GetValue<int>("AiSettings:FreeMaxTokens", 512);

            return new InferenceParams
            {
                //MaxTokens = maxTokens,
                AntiPrompts = new List<string> { "User:", "\n\nUser:" },
                SamplingPipeline = new DefaultSamplingPipeline
                {
                    Temperature = 0.3f,
                    TopK = 40,
                    TopP = 0.9f,
                    MinP = 0.05f,
                    RepeatPenalty=1.1f,
                    Seed=42,
                }
            };
        }
        private void CleanupExpiredSessions(object? state)
        {
            try
            {
                var expiredTime = DateTime.UtcNow.AddMinutes(-_sessionTimeoutMinutes);
                var expiredSessions = _activeSessions
                    .Where(kvp => kvp.Value.LastAccessed < expiredTime)
                    .Select(kvp => kvp.Key)
                    .ToList();

                foreach (var sessionId in expiredSessions)
                {
                    if (_activeSessions.TryRemove(sessionId, out var wrapper))
                    {
                        wrapper.Lock.Dispose();
                        _logger?.LogDebug("Removed expired session: {SessionId}", sessionId);
                    }
                }

                if (expiredSessions.Count > 0)
                {
                    _logger?.LogInformation("Cleaned up {Count} expired sessions. Active sessions: {Active}",
                        expiredSessions.Count, _activeSessions.Count);
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error during session cleanup");
            }
        }

        public void ClearSession(string sessionId)
        {
            if (_activeSessions.TryRemove(sessionId, out var wrapper))
            {
                wrapper.Lock.Dispose();
                _logger?.LogInformation("Manually cleared session: {SessionId}", sessionId);
            }
        }

        public int GetActiveSessionCount() => _activeSessions.Count;

        public void Dispose()
        {
            _cleanupTimer?.Dispose();
            _inferenceSemaphore?.Dispose();

            foreach (var wrapper in _activeSessions.Values)
            {
                wrapper.Lock.Dispose();
            }
            _activeSessions.Clear();

            _model?.Dispose();

            _logger?.LogInformation("LLamaServiceAI disposed");
        }
        /// <summary>
        /// system authore ai
        /// </summary>
        /// <returns></returns>
        private string GetSystemPrompt()
        {
            string promt = @"You are a professional Legal Advisor AI specialized in law and legal documents. 
When the user uploads a file and provides additional content, you must:

1. Read and analyze the uploaded file thoroughly.
2. Combine your analysis with the user's content.
3. Provide a **detailed, structured, professional legal report in plain text only**. 
4. The report should include:
   - Classification of the document (Contract, Statute, Regulation, CaseLaw, Other).
   - Summary of main points.
   - Legal analysis and interpretation.
   - Assessment of risks or compliance issues.
   - Recommendations or next steps.
   - Final legal conclusion.

Important rules:
- Always use precise legal terminology.
- Never return JSON, markdown, or any format other than plain text.
- If the document is not legal or outside the scope of law, clearly state that in plain text.
- Do not add explanations outside of the legal analysis or report.";
            return promt;
        }
    }
}
