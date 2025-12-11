
using Microsoft.AspNetCore.Http;

namespace Cms.ModelsView.Legal.Models
{
    public class ChatAIViewModels
    {
       public ProfileChatViewModels profile { get;set; }
        public HistoryChatAIViewModels history { get;set; }
        public AttributesDocumentViewModels attributes { get;set; }
    }
    public class ProfileChatViewModels
    {
        public string nick_name { get; set; }
        public string token { get; set; }
        public int quanity_chat { get; set; } = 0;
        public long number_char { get; set; }=0;
        public string ip_chat { get; set; }
        public string device { get; set; }
    }
    public class HistoryChatAIViewModels
    {
        public string code { get; set; }
        public string title { get; set; }
        public DateOnly create_at { get; set; }
    }
    public class AttributesDocumentViewModels
    {
        public string file_name { get; set; }
        public string type_file { get; set; }
        public string size { get; set; }
        public DateOnly create_at { get; set; }
    }
    public class ListLogChatViewModels
    {
        public string role { get; set; }
        public string content { get; set; }
    }
    public class PayloadViewModels
    {
        public string role { get; set; }
        public string content { get; set; }
        public string code_chat { get; set; }
        public IFormFile UploadedFiles { get; set; }
        public string session_code { get; set; }
        public string type_page { get; set; }
    }
}
