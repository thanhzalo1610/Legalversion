using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.QueryData;
using Cms.Legal.Areas.SystemAreas;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;
using System.Text.Json;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class ChatAIViewComponent : ViewComponent
    {
        private readonly ChatAIQuery _chatQuery;
        public ChatAIViewComponent(ChatAIQuery chatquery)
        {
            _chatQuery = chatquery;
        }
        public async Task<IViewComponentResult> InvokeAsync(string message=null,string user="")
        {
            if (string.IsNullOrEmpty(message))
            {
                var models = await _chatQuery.ListAllChat(user);
                return View(models);
            }
            return View();
        }
    }
    public class HistoryChatViewModel()
    {
        public string role { get; set; }
        public string content { get; set; }
    }
}
