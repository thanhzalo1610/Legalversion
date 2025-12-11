using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class HeaderViewComponent:ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(string view_name = "Default")
        {
            return View(view_name);
        }
    }
}
