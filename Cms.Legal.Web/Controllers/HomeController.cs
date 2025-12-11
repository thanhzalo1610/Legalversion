using Cms.Legal.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.Extensions.FileProviders;
using System.Diagnostics;
using System.Reflection;

namespace Cms.Legal.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ICompositeViewEngine _viewEngine;

        public HomeController(ILogger<HomeController> logger, ICompositeViewEngine viewEngine)
        {
            _logger = logger;
            _viewEngine = viewEngine;
        }

        public IActionResult Index()
        {
            return View();
        }
        [Route("{slug}/{category?}/{id?}")]
        public IActionResult Page(string slug = "", string category = "", string id = "")
        {
            if (!string.IsNullOrEmpty(slug))
            {

                string name = slug.Replace("-", "").Trim();
                if (ViewExists(name))
                {
                    return View(name);
                }
                else
                {
                    return Redirect("not-found");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        private bool ViewExists(string viewName)
        {
            var result = _viewEngine.FindView(ControllerContext, viewName, false);
            return result.Success;
        }
    }
}
