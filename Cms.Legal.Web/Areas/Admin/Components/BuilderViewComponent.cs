using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class BuilderViewComponent:ViewComponent
    {
        public async Task<IViewComponentResult>InvokeAsync(string position = "Default")
        {
            return View("Default", position);
        }
    }
}
