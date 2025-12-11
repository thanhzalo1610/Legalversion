using Cms.Legal.Areas.QueryData;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Cms.Legal.Web.Areas.Admin.Controllers
{
    [Authorize]
    [Area("admin")]
    [Route("admin/manage-account")]
    public class ManageAccountController : Controller
    {
        private readonly AccountQuery _accountQuery;
        public ManageAccountController(AccountQuery accountQuery)
        {
            _accountQuery = accountQuery;
        }
        //[Authorize(Roles ="admin,superadmin")]
        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("profile/{id?}")]
        public async Task<IActionResult> ProfileUser(string id = "")
        {
            var model = new ManagerProfileViewModels();
            if (!string.IsNullOrEmpty(id))
            {
                model = await _accountQuery.GetProfile(id);
            }
            return View(model);
        }
        [HttpGet("edit-profile")]
        public IActionResult UpsertProfile(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                var get = "";
            }
            return View();
        }
    }
}
