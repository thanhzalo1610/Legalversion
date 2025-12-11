using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Polly;
using System.Text;

namespace Cms.Legal.Web.Components
{
    public class SearchViewComponent:ViewComponent
    {
        private readonly IConfiguration _configuration;
        public SearchViewComponent(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<IViewComponentResult> InvokeAsync(string viewname,SearchFormViewModel model)
        {
            if (string.IsNullOrEmpty(viewname)==false)
            {
                string json_promt = JsonConvert.SerializeObject(model);
                var list_gemini=await FindUsingGemini(json_promt);
                return View(viewname,model);
            }
            return View("Default",model);
            
        }

        private async Task<List<object>> FindUsingGemini(string json_context)
        {
            try
            {
                string apiKey = "AIzaSyBcgSZEvLp-FC-1Y9V1i-BcxBfr4e9od5M", str_answer = "";
                string model = _configuration["Gemini:model"];
                string url = _configuration["Gemini:url"];
                string promt = promtsearch(json_context);
                using (var client = new HttpClient())
                {
                    string genUrl = $"{url}{model}:generateContent?key={apiKey}";

                    var payload = new
                    {
                        contents = new[]
                        {
                            new {
                                role = "user",
                                parts = new object[]
                                {
                                    new { text = promt }
                                }
                            }
                        },
                        generationConfig = new
                        {
                            temperature = 0.7,
                            topK = 60,
                        }
                    };

                    var json = JsonConvert.SerializeObject(payload);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var genResponse = await client.PostAsync(genUrl, content);
                    string genRaw = await genResponse.Content.ReadAsStringAsync();

                    if (!genResponse.IsSuccessStatusCode)
                        return new List<object>();

                    dynamic genData = JsonConvert.DeserializeObject(genRaw);
                    str_answer = genData.candidates[0].content.parts[0].text.ToString();
                    //make sure the service has been stopped
                    client.Dispose();
                    genResponse.Dispose();

                }
                return new List<object>();
            }
            catch (Exception ex)
            {
                return new List<object>();
            }
        }
        private string promtsearch(string json_promt)
        {
            string prompt = @"
I NEED VERIFIED LAWYER DATA BASED ON THE FOLLOWING INPUT:
"+json_promt+@"

REQUIRED ACTIONS:
1. Search for lawyers or law firms that match the criteria using reputable international sources only (bar associations, Martindale, Chambers, Avvo, Justia, Lawyers.com, LinkedIn, firm websites, major legal directories). Never return Vietnamese (.vn) websites or Vietnamese content.
2. For each candidate, strictly VERIFY the following:
   a. The main profile URL must return HTTP 200. Try HEAD first; if HEAD fails, try GET. Reject any URL with 404, 410, 500, or soft-404 pages.
   b. The page must contain the lawyer or law firm name and evidence of legal categories or practice areas.
   c. If the page contains a profile image, extract the image URL and ensure it also returns HTTP 200. If no valid profile image exists, use an empty string.
   d. Extract rating and rating count if available; otherwise set rating to null and numberrating to 0.
3. Remove duplicate entries (same URL).
4. Return at most max_results verified entries.
5. All returned URLs must be HTTPS when available.
6. OUTPUT MUST BE A SINGLE JSON ARRAY ONLY (no explanations, no logs, no additional text). Each object must have exactly the following structure:

[
  {
    ""image"": ""<string - image URL or empty>"",
    ""name"": ""<string - lawyer or firm name>"",
    ""ratting"": <number|null>,
    ""numberrating"": <integer>,
    ""category_law"": [""<string>"", ...],
    ""description"": ""<1-2 sentence summary from the verified website>"",
    ""url"": ""<verified URL that returns HTTP 200>""
  }
]

IMPORTANT RULES:
- ""image"": must be empty string if no valid image exists.
- ""ratting"": must be a float or null.
- ""numberrating"": must be an integer.
- ""category_law"": empty array allowed.
- ""url"": must be verified reachable.

If no results are found, return an empty array [].

BEGIN SEARCH using the combined keywords: area, country, state/province, city, category law, type law, and free text search.
";
            return prompt;
        }
    }
}
