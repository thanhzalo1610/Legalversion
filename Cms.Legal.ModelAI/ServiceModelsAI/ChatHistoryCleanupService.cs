using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Cms.Legal.ModelAI.ServiceModelsAI.ChatHistoryCleanupService
{

    /// <summary>
    /// Background service to cleanup old chat sessions
    /// Runs periodically to prevent storage bloat
    /// </summary>
    public class ChatHistoryCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ChatHistoryCleanupService> _logger;
        private readonly TimeSpan _cleanupInterval;
        private readonly TimeSpan _sessionMaxAge;

        public ChatHistoryCleanupService(
            IServiceProvider serviceProvider,
            IConfiguration configuration,
            ILogger<ChatHistoryCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;

            var intervalHours = configuration.GetValue<int>("AiSettings:CleanupIntervalHours", 6);
            var maxAgeHours = configuration.GetValue<int>("AiSettings:SessionMaxAgeHours", 48);

            _cleanupInterval = TimeSpan.FromHours(intervalHours);
            _sessionMaxAge = TimeSpan.FromHours(maxAgeHours);

            _logger.LogInformation("Chat history cleanup service initialized. Interval: {Interval}h, Max age: {MaxAge}h",
                intervalHours, maxAgeHours);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Chat history cleanup service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(_cleanupInterval, stoppingToken);

                    _logger.LogInformation("Starting chat history cleanup...");

                    using var scope = _serviceProvider.CreateScope();
                    var historyStore = scope.ServiceProvider.GetRequiredService<IChatHistoryStore>();

                    await historyStore.CleanupOldSessionsAsync(_sessionMaxAge);

                    _logger.LogInformation("Chat history cleanup completed");
                }
                catch (OperationCanceledException)
                {
                    // Expected when stopping
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during chat history cleanup");
                }
            }

            _logger.LogInformation("Chat history cleanup service stopped");
        }
    }

}