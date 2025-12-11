using Cms.Legal.Areas.SystemAreas;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class SidebarViewComponent : ViewComponent
    {
        private readonly SecureCookieCrypto _crypto;
        public SidebarViewComponent(SecureCookieCrypto crypto)
        {
            _crypto = crypto;
        }
        public async Task<IViewComponentResult> InvokeAsync(string view_name = "Default")
        {
            //var menu = ListMenu();
            return View(view_name);
        }
        //private List<MenuViewModels> ListMenu()
        //{
        //    var encrypted = Request.Cookies["client_info"];

        //    var json = _crypto.Decrypt(encrypted);
        //    var result = JsonConvert.DeserializeObject<SessionContactViewModels>(json);
        //    return result.menu;
        //}
    }
}
