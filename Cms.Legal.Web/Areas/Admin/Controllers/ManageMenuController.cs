using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.QueryData;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Threading.Tasks;

namespace Cms.Legal.Web.Areas.Admin.Controllers
{
    [Authorize("SuperAdmin")]
    [Area("Admin")]
    [Route("admin/manage-menu")]
    public class ManageMenuController : Controller
    {
        private readonly MenuQuery _menuQuery;
        private readonly AccountQuery _accountQuery;
        public ManageMenuController(MenuQuery menuQuery,AccountQuery accountQuery)
        {
            _menuQuery = menuQuery;
            _accountQuery = accountQuery;
        }
        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("menu/{id?}")]
        public async Task<IActionResult> ListMenuDes(string id = "")
        {
            ViewData["id"] =id;
            return View();
        }
        [HttpGet("modify/{id?}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpsertMenu(string id = "")
        {
            var model = new Menu();
            if (!string.IsNullOrEmpty(id))
            {
                model = await _menuQuery.GetMenu(id);
            }
            else
            {
            }
                return View(model);
        }
        [HttpPost("modify/{id?}")]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> UpsertMenu(Menu model)
        {
            if (ModelState.IsValid)
            {
                var st = await _menuQuery.UpsertMenu(model);
                return Ok(st);
            }
            else
            {
                var st = new
                {
                    code = 500,
                    status = "warning",
                    title = "Warning field",
                    message = "Field",
                };
                return Ok(st);
            }

        }

        [HttpGet("modify-menu/{id?}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpsertMenuDes(string id="")
        {
            var model = new MenuDe();
            if (!string.IsNullOrEmpty(id))
            {
                model = await _menuQuery.GetMenuDes(id);
            }
            var list_menu = await _menuQuery.ListAllMenu();
            ViewBag.MenuCode = new SelectList(list_menu, "Code", "Title");
            ViewBag.TypeView = new SelectList(new TypeViewMenu().types(), "code", "title");
            ViewBag.TypeField = new SelectList(new TypeField().types(), "code", "title");
            return View(model);
        }
        [HttpPost("modify-menu/{id?}")]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> UpsertMenuDes(MenuDe model)
        {
            var st = new StatusViewModels();
            st= await _menuQuery.UpsertMenuDes(model);

            return Json(st);
        }
        [HttpGet("modify-rolemenu/{id?}")]
        public async Task<IActionResult> UpsertRoleMenu(string id = "")
        {
            var model = new MenuRole();

            if (!string.IsNullOrEmpty(id))
            {
                model=await _menuQuery.GetMenuRole(id);
            }
            else
            {
                model.IsDeleted= false;
                model.IsView= false;
                model.IsEdit= false;
                model.IsCreate= false;
            }
                var list_use = await _accountQuery.ListMenuSelect();
            var list_menu=await _menuQuery.ListAllMenu();
            ViewBag.MenuCode =new SelectList(list_menu, "Code", "Title");
            ViewBag.UserId = new SelectList(list_use, "CodeUser", "UserName");
            ViewBag.MenuDesCode =new SelectList(new List<string>());
            ViewBag.ParentId =new SelectList(new List<string>());
            return View(model);
        }

        [HttpPost("modify-rolemenu/{id?}")]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertRoleMenu(MenuRoleViewModels model)
        {
            var st=await _menuQuery.UpsertMenuRole(model);
            return Json(st);
        }

        [HttpGet("component-field")]
        [AllowAnonymous]
        public IActionResult UpdatePreview(string type,string id,string menucode)
        {
            string view_name = type;
            return ViewComponent("TypeField", new { view_name, id,menucode });
        }
    }
}
