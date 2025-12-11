using Cms.Legal.Areas.QueryData;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class MenuViewComponent:ViewComponent
    {
        private readonly MenuQuery _menuQuery;

        public MenuViewComponent(MenuQuery menuQuery)
        {
            _menuQuery = menuQuery;
        }

        public async Task<IViewComponentResult> InvokeAsync(string view_name="Default",string id="")
        {
            if (view_name == "Default")
            {
                var list=await _menuQuery.ListAllMenu();
                return View(view_name, list);
            }
            else
            {
                var list = await _menuQuery.ListMenuDes(id);
                return View(view_name,list);
            }
        }
    }
}
