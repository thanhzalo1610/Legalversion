using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cms.Legal.Web.Controllers
{
    [Route("lawyer")]
    public class LawyerController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("search-lawyer")]
        public IActionResult FindLawyer(SearchFormViewModel model)
        {
            TempData["search"] = model;
            return View();
        }
        [HttpGet("register-lawyer")]
        public IActionResult RegisterLawyer()
        {
            return View();
        }
        [HttpGet("profile/{id?}")]
        public IActionResult ProfileLawyer(string id="")
        {
            return View();
        }
    }
}
