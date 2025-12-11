using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Controllers
{
    public class ErrorController : Controller
    {
        [HttpGet("not-found")]
        public IActionResult NotFound()
        {
            return View();
        }
    }
}
