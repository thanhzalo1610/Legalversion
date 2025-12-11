using Cms.Legal.Areas.QueryData;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Controllers
{
    [Route("query-view")]
    public class QueryComponentController : Controller
    {
        private readonly LayoutQuery _layoutQuery;

        public QueryComponentController(LayoutQuery layoutQuery)
        {
            _layoutQuery = layoutQuery;
        }

        [HttpGet("location-view")]
        public async Task<IActionResult> LocationViewAsync(long id = 0, string name = "", string view = "")
        {
            switch (name)
            {
                case "type_law":
                    return ViewComponent("SelectLayout", new { viewname = "CategoryLaw", data = view, type = id, title = view });
                case "city":
                    return ViewComponent("SelectLayout", new { viewname = "Default", data = view, type = id, title = view });
                case "country":
                    return ViewComponent("SelectLayout", new { viewname = "Default", data = view, type = id, title = view });
                case "state":
                    return ViewComponent("SelectLayout", new { viewname = "Default", data = view, type = id, title = view });
                default:
                    return ViewComponent("SelectLayout", new { viewname = "Default", data = view, type = id, title = view });
            }
        }
        [HttpPost("search-law")]
        public async Task<IActionResult> SearchLawyer([FromBody] SearchFormViewModel model)
        {
            return ViewComponent("Search", new {viewname="Result", model = model });
        }
    }

}
