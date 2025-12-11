using Cms.Legal.Areas.QueryData;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Areas.Admin.Components
{
    public class ListAccountViewComponent:ViewComponent
    {
        private readonly AccountQuery _accountQuery;
        public ListAccountViewComponent(AccountQuery accountQuery)
        {
            _accountQuery = accountQuery;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var list=await _accountQuery.ListALlAccount();
            return View (list);
        }
    }
}
