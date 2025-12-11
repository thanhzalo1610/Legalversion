using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Areas.Admin.Controllers
{
    [Authorize]
    [Area("Admin")]
    [Route("admin/mock-trial")]
    public class MockTrialController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
