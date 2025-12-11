
using LLama.Common;

namespace Cms.Legal.ModelAI.ServiceModelsAI.ChatHistoryCleanupService
{

    /// <summary>
    /// Interface for storing and retrieving chat history
    /// Allows different implementations: File, Redis, Database, etc.
    /// </summary>
    public interface IChatHistoryStore
    {
        /// <summary>
        /// Load chat history for a session
        /// Returns empty history if session doesn't exist
        /// </summary>
        Task<ChatHistory> LoadHistoryAsync(string sessionId);

        /// <summary>
        /// Save chat history for a session
        /// </summary>
        Task SaveHistoryAsync(string sessionId, ChatHistory history, bool isVipUser = false);

        /// <summary>
        /// Delete chat history for a session
        /// </summary>
        Task DeleteHistoryAsync(string sessionId);

        /// <summary>
        /// Check if session exists
        /// </summary>
        Task<bool> ExistsAsync(string sessionId);

        /// <summary>
        /// Get all active session IDs (for cleanup/monitoring)
        /// </summary>
        Task<IEnumerable<string>> GetActiveSessionsAsync();

        /// <summary>
        /// Cleanup old sessions (older than specified time)
        /// </summary>
        Task CleanupOldSessionsAsync(TimeSpan olderThan);
    }

}