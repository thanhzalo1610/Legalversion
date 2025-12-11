using Microsoft.AspNetCore.Mvc;

namespace PlatformAILegal.Components
{
    
    public class BuilderLayoutViewComponent:ViewComponent
    {
        public async Task<IViewComponentResult>InvokeAsync(string view_name="Default",string tag_name = "")
        {

            return View(view_name, tag_name);
        }
    }
}
