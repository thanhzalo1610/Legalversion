using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class DashboardViewComponent:ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(string view_name = "Default", string position = "", string name = "")
        {
            var obj = new DashboardViewModels()
            {
                name = position,
                type = name,
                data = null
            };
            return View(view_name, obj);
        }
    }
}
