using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.QueryData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UAParser;

namespace Cms.Legal.Web.Areas.Admin.Controllers
{
    [Authorize]
    [Area("Admin")]
    [Route("admin/legal-advice")]
    public class LegalAdviceController : Controller
    {
        private readonly ChatAIQuery _chatQuery;
        public LegalAdviceController(ChatAIQuery chatQuery) {
            _chatQuery= chatQuery;
        }
        // GET: LegalAdviceController
       [HttpGet("")]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet("legalai-chat")]
        public async Task<ActionResult> LegalAIChat()
        {
            return View();
        }

        //// GET: LegalAdviceController/Create
        //public ActionResult Create()
        //{
        //    return View();
        //}

        //// POST: LegalAdviceController/Create
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Create(IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: LegalAdviceController/Edit/5
        //public ActionResult Edit(int id)
        //{
        //    return View();
        //}

        //// POST: LegalAdviceController/Edit/5
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Edit(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: LegalAdviceController/Delete/5
        //public ActionResult Delete(int id)
        //{
        //    return View();
        //}

        //// POST: LegalAdviceController/Delete/5
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Delete(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}
    }
}
