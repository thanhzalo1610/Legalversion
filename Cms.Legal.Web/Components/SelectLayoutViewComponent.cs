using Cms.Legal.Areas.QueryData;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Mvc;

namespace PlatformAILegal.Components
{
    public class SelectLayoutViewComponent:ViewComponent
    {
        private readonly LayoutQuery _layoutQuery;
        public SelectLayoutViewComponent(LayoutQuery layoutQuery)
        {
            _layoutQuery = layoutQuery;
        }
        public async Task<IViewComponentResult>InvokeAsync(string viewname="Default",string data="",long type =0,string title="")
        {
            if (viewname == "Default")
            {
                var list=new List<AreaViewModels>();
                if (string.IsNullOrEmpty(data)==true)
                {
                    list =await _layoutQuery.ListLocal("regions", 0);
                }
                else
                {
                    list = await _layoutQuery.ListLocal(data, type);
                }
                    ViewBag.Title_Select = "Select.";
                return View(viewname,list);
            }
            else
            {
                var list_cate =await _layoutQuery.ListCategoryLaw(data);
                ViewBag.Title_Select = "Select Category Law.";
                return View(viewname,list_cate);
            }
        }
    }
}
