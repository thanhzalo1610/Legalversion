using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.QueryData;
using Cms.Legal.Areas.SystemAreas;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Text;
using System.Threading.Tasks;
using static Cms.ModelsView.Legal.Models.GPTViewModels;

namespace Cms.Legal.Web.Controllers
{
    [Route("case")]
    public class CaseController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;
        private readonly MockTrialQuery _mockTrialQuery;
        private readonly SecureCookieCrypto _crypto;
        private readonly LayoutQuery _layoutQuery;
        public CaseController(IConfiguration configuration,
            MockTrialQuery mockTrialQuery,
            LayoutQuery layoutQuery,
            SecureCookieCrypto secureCookieCrypto)
        {
            _configuration = configuration;
            _mockTrialQuery = mockTrialQuery;
            _layoutQuery = layoutQuery;
            _crypto = secureCookieCrypto;
        }
        [HttpGet("case-contract-analysis")]
        public IActionResult CaseContractAnalysis()
        {
            return View();
        }
        //[Authorize]
        [AllowAnonymous]
        [HttpGet("mock-trial")]
        public async Task<IActionResult> MockTrial(string id = "")
        {
            var model = new MockTrialViewModels();
            if (!string.IsNullOrEmpty(id))
            {
                //model = await _mockTrialQuery.GetMockTrialByCodeAsync(id);
                var list_categories = await _layoutQuery.ListCategoryLaw("Nan");
                ViewBag.categoryId = new SelectList(list_categories, "Code", "Title", model.categoryId);
            }
            else
            {
                var list_categories = await _layoutQuery.ListCategoryLaw("Nan");
                ViewBag.categoryId = new SelectList(list_categories, "Code", "Title", model.categoryId);
            }
            return View(model);
        }
        [HttpGet("list-mocktrial")]
        //[Authorize]
        public async Task<IActionResult> ListMockTrial()
        {
            var guestCookie = Request.Cookies["client_info"];
            if (!string.IsNullOrEmpty(guestCookie))
            {
                var jsons = _crypto.Decrypt(guestCookie);
                var guestData = System.Text.Json.JsonSerializer.Deserialize<SessionContactViewModels>(jsons);
                //if (User.Identity.IsAuthenticated == false)
                //{
                //    return Redirect("/login");
                //}
                //else
                //{
                var st = await _mockTrialQuery.ListMockTrial(guestData.GuestSession.UserId);
                return Json(st);
                //}
            }
            return Json(null);
        }
        [HttpPost("get-mocktrial")]
        //[Authorize]
        public async Task<IActionResult> GetTrial([FromBody] string code="")
        {
                var st = await _mockTrialQuery.GetContentTrial(code);
                return Json(st);
        }
        [HttpPost("upsert-mocktrial")]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> UpsertMockTrial(MockTrial model)
        {
            var st = await _mockTrialQuery.UpsertMockTrialAsync(model);
            return Json(st);
        }

        [HttpGet("overview-result")]
        public IActionResult OverViewResult()
        {
            return View();
        }

        [HttpPost("ai-analysis")]
        public async Task<IActionResult> AIChatGPTAsync(string json, string type)
        {
            string out_data = "Nan";
            string pormt = json;
            try
            {
                // 2. CHUẨN BỊ REQUEST CHO GEMINI (chỉ tin nhắn người dùng)

                // Tạo Content cho tin nhắn người dùng
                var userContent = new Content();
                if (type == "file")
                {
                    userContent = new Content
                    {
                        Role = "user",
                        Parts = new List<Part> { new Part { Text = contentanalysis() + pormt } }
                    };
                }
                else
                {
                    userContent = new Content
                    {
                        Role = "user",
                        Parts = new List<Part> { new Part { Text = overview() + pormt } }
                    };

                }

                var request = new GenerateContentRequest
                {
                    Contents = new List<Content> { userContent },
                    // Dùng tên thuộc tính đã sửa ở class DTO
                    GenerationConfig = new GenerationConfig { Temperature = 0.7 }
                };

                string jsonRequest = JsonConvert.SerializeObject(request);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                // 3. GỌI API GEMINI
                using (var client = new HttpClient())
                {
                    // Lấy thông tin cấu hình từ Web.config
                    string api_key = _configuration["GPT:key"];
                    string model = _configuration["GPT:model"];
                    string urlTemplate = _configuration["GPT:url"];

                    // Thay thế placeholder trong URL
                    string finalUrl = urlTemplate
                                    .Replace("{model}", model)
                                    .Replace("{API_KEY}", api_key);

                    HttpResponseMessage response = await client.PostAsync(finalUrl, content);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        var geminiResponse = JsonConvert.DeserializeObject<GenerateContentResponse>(jsonResponse);

                        // Lấy câu trả lời
                        out_data = geminiResponse.Candidates[0].Content.Parts[0].Text;

                        out_data = out_data.Replace("```json", "").Replace("```", "").Trim();
                        return Json(out_data);
                    }
                    else
                    {
                        // Xử lý lỗi từ API Gemini
                        string errorContent = await response.Content.ReadAsStringAsync();
                        int statusCode = (int)response.StatusCode;
                        return Json(statusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(400);
            }
        }
        private string contentanalysis()
        {
            string promt = @"You are a Legal AI. Every response MUST be returned as a SINGLE JSON object following the exact structure below. No explanations, no markdown, no additional text outside the JSON. All content must use precise, formal legal terminology.

Required JSON structure:
{
  ""assessment_results"": {
    ""risk_level"": ""<Risk level: Low Risk / Medium Risk / High Risk>"",
    ""document_type"": ""<Type of legal document>"",
    ""summary"": ""<Concise legal summary of the document>"",
    ""key_points"": [
        ""<Key point 1>"",
        ""<Key point 2>"",
        ""<Key point 3>""
    ],
    ""detected_risks"": [
        ""<Identified risk 1>"",
        ""<Identified risk 2>""
    ],
    ""recommendations"": [
        ""<Recommendation 1>"",
        ""<Recommendation 2>"",
        ""<Recommendation 3>""
    ]
  }
}

Mandatory rules:
1. Always output the JSON exactly as defined above. No missing fields, no additional fields.
2. All language must follow formal legal standards.
3. Do NOT output anything outside the JSON object under any circumstance.";

            return promt;
        }
        private string overview()
        {
            string jsonTemplate = @"You are a Legal AI. I will provide you with the text Legal you analyze, classify, summarize, retrieve, predict cases, fees,... in the legal field you know. You will fill in the data in the JSON templates below which must be in Json format.
2. Return ONLY JSON. No extra commentary or text **Required**.
Json Template:
{
  ""OutcomePrediction"": {
    ""PlaintiffWin"": ""0-100"",
    ""Reconcile"": ""0-100"",
    ""DefendantWin"": ""0-100"",
    ""Comments"": {
      ""PlaintiffWin"": ""string explanation"",
      ""Reconcile"": ""string explanation"",
      ""DefendantWin"": ""string explanation""
    }
  },
  ""AnalyzeKeyFactors"": [
    {
      ""Element"": ""name of factor"",
      ""ImpactLevel"": ""Strong/Medium/Weak""
    }
  ],
  ""EvidenceAndWitnesses"": [
    {
      ""TypeOfEvidence"": ""evidence type"",
      ""ImpactLevel"": ""Strong/Medium/Weak""
    }
  ],
  ""Proposals"": [
    ""recommendation 1"",
    ""recommendation 2""
  ],
  ""DamageForecastingAndCompensation"": {
    ""EconomicOrCompensation"": ""percentage as string, e.g., '50%'"",
    ""NonEconomicEmotionalMoralSocial"": ""percentage as string"",
    ""PunitivePenaltyIfApplicable"": ""percentage as string""
  },
  ""LegalAnalysisFactorsTable"": [
    {
      ""Factor"": ""legal violation or key point"",
      ""StatuteRule"": ""applicable statute or rule"",
      ""DescriptionAndRelatedDetails"": ""short explanation"",
      ""LevelOfInfluence"": ""Strong/Medium/Weak""
    }
  ],
  ""ListOfCasesSample"": [
    {
      ""Case"": ""case ID or name"",
      ""Judge"": ""judge name"",
      ""Day"": ""YYYY-MM-DD"",
      ""Match"": ""similarity percentage as string""
    }
  ],
  ""SamplePredictionTable"": {
    ""Case"": ""case ID or name"",
    ""Prediction"": ""e.g., Guilty / Not Guilty"",
    ""Match"": ""similarity percentage as string"",
    ""MainFactorsFeatureImportance"": [
      ""factor1: high/medium/low"",
      ""factor2: high/medium/low""
    ]
  }
}
RETURN ONLY CLEAN JSON. NO TEXT **REQUIRED** OUTSIDE JSON.
Case text:";
            return jsonTemplate;
        }
    }
}
