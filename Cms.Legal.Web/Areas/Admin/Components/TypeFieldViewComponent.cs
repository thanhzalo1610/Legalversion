using Cms.Legal.Areas.QueryData;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class TypeFieldViewComponent : ViewComponent
    {
        private readonly MenuQuery _menuQuery;

        public TypeFieldViewComponent(MenuQuery menuQuery)
        {
            _menuQuery = menuQuery;
        }
        public async Task<IViewComponentResult> InvokeAsync(string view_name, string id, string menucode)
        {
            var name = view_name == "icon" ? "Default" : "Image";
            if (view_name == "ParentMenu")
            {
                var list = await _menuQuery.ListMenuParent(id, menucode);
                return View(view_name, list);
            }
            if (view_name == "MenuDes")
            {
                var list = await _menuQuery.ListMenuDes(menucode);
                return View("ParentMenu", list);
            }
            return View(name);
        }
    }
}
