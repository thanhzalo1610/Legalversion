using Azure;
using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.QueryData;
using Cms.Legal.Areas.SystemAreas;
using Cms.Legal.ModelAI.ServiceModelsAI;
using Cms.ModelsView.Legal.Models;
using GenerativeAI;
using IronOcr;
using MailKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.AI;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using RestEase;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using static Cms.ModelsView.Legal.Models.GPTViewModels;
using static Google.Apis.Requests.BatchRequest;
using static System.Net.Mime.MediaTypeNames;

namespace Cms.Legal.Web.Controllers
{
    [Route("legal")]
    public class LegalController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ChatAIQuery _chatQuery;
        private readonly LocationService _locationService;
        private readonly LLamaServiceAI _llamaService;
        private readonly ILogger<LegalController> _logger;
        private readonly SecureCookieCrypto _crypto;

        public LegalController(IConfiguration configuration,
            ChatAIQuery chatAIQuery,
            LocationService locationService,
            SecureCookieCrypto crypto,
            LLamaServiceAI lLamaServiceAI,
            ILogger<LegalController> logger)
        {
            _configuration = configuration;
            _locationService = locationService;
            _chatQuery = chatAIQuery;
            _crypto = crypto;
            _llamaService = lLamaServiceAI;
            _logger = logger;
        }
        [HttpGet("chat")]
        public async Task<IActionResult> ChatLegal()
        {
            var guestCookie = Request.Cookies["client_info"];
            if (guestCookie != null)
            {
                var jsons = _crypto.Decrypt(guestCookie);
                var guestData = System.Text.Json.JsonSerializer.Deserialize<SessionContactViewModels>(jsons);
                var guest = new Chatai()
                {
                    AppName = guestData.GuestSession.AppName,
                    DeviceUser = guestData.GuestSession.DeviceUser,
                    NickName = guestData.GuestSession.NickName,
                    RoleUser = guestData.GuestSession.RoleUser,
                    IpUser = guestData.GuestSession.IpUser,
                    UserId = guestData.GuestSession.UserId,
                };
                var data = await _chatQuery.UpsertChatAI(guest);
                TempData["data_user"] = data.data;
            }
            return View();
        }

        [HttpPost("ai-chat")]
        [Consumes("multipart/form-data")]
        [Produces("application/json")]
        [RequireHttps] // Bắt buộc HTTPS
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [RequestSizeLimit(5485760)] //5MB limit
        [RequestFormLimits(MultipartBodyLengthLimit = 5485760, ValueCountLimit = 10)]
        public async Task<IActionResult> AIChatGPTAsync([FromForm] PayloadViewModels payload, CancellationToken cancellationToken = default)
        {
            try
            {
                var time=Stopwatch.StartNew();
                var objec_firstas = new object();
                //get cookie client use infomation
                var guestCookie = Request.Cookies["client_info"];
                if (guestCookie != null)
                {
                    var jsons = _crypto.Decrypt(guestCookie);
                    var guestData = System.Text.Json.JsonSerializer.Deserialize<SessionContactViewModels>(jsons);
                    payload.role = guestData.role;
                }
                var log_chat = new StatusViewModels();
                string title_chat = "";

                if (payload.content != "" && payload.content != null)
                {
                    title_chat = payload.content.Length < 150 ? payload.content : payload.content.Substring(150);
                }
                var log = new Logchatai()
                {
                    Block = false,
                    Code = payload.session_code,
                    Title = title_chat,
                    ChataiCode = payload.code_chat
                };

                if (payload.session_code == "" || payload.session_code == null)
                {
                    log_chat = await _chatQuery.UpsertLogChat(log);
                }
                else
                {
                    log_chat.code = 200;
                }
                if (log_chat.code == 200)
                {
                    var l = log_chat.data as Logchatai;
                    var content_chat = new Contentchatai()
                    {
                        LogchataiCode = l != null ? l.Code : payload.session_code,
                        ContentChat = payload.content,
                        SendAt = DateTime.UtcNow,
                    };
                    var st = await _chatQuery.UpsertContentChat(content_chat);


                    if (payload.UploadedFiles != null)
                    {
                        objec_firstas = new
                        {
                            answer = "Sorry we do not develop this function yet. Please use chat to let AI advise you.",
                            session_code = (st.data as Contentchatai).Code,
                        };
                    }
                    else
                    {
                        if (string.IsNullOrWhiteSpace(payload.content))
                        {
                            objec_firstas = new
                            {
                                answer = "Please enter text chat. AI have advices legal or law.",
                                session_code = (st.data as Contentchatai).Code,
                            };
                        }
                        else
                        {
                            var sessionId = payload.code_chat ?? Guid.NewGuid().ToString();

                            //_logger.LogInformation("Processing chat request. SessionId: {SessionId}, MessageLength: {Length}",
                            //    sessionId, payload.content.Length);

                            var response = await _llamaService.ChatAsync(sessionId, payload.content, isVipUser: false);
                            var cca = st.data as Contentchatai;
                            content_chat.ReceiveAt = DateTime.UtcNow;
                            content_chat.ReceiveChat = response.ToString();
                            content_chat.Code = cca != null ? cca.Code : "";
                            await _chatQuery.UpsertContentChat(content_chat);
                            string format_str = ConfigGeneral.Format(response.ToString()).Replace("System:","").Replace("User:","");
                            objec_firstas = new
                            {
                                answer = format_str,
                                session_code = content_chat.Code,
                            };
                        }
                    }
                }
                else
                {
                    objec_firstas = new
                    {
                        answer = "Error processing chat request.",
                        session_code = "",
                    };
                }
                time.Stop();
                Console.WriteLine("Time end process:"+ time.ElapsedMilliseconds);
                return Json(objec_firstas);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Maximum session limit"))
            {
                var objec_firsta = new
                {
                    answer = "Maximum session token. Please sign in to use better service thanks.",
                    session_code = "",
                };
                return Json(objec_firsta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing chat request");
                var objec_firsta = new
                {
                    answer = "Internal server error.",
                    session_code = "",
                };
                return Json(objec_firsta);
            }
            //var guestCookie = Request.Cookies["client_info"];
            //if (guestCookie != null)
            //{
            //    var jsons = _crypto.Decrypt(guestCookie);
            //    var guestData = System.Text.Json.JsonSerializer.Deserialize<SessionContactViewModels>(jsons);
            //    payload.role = guestData.role;
            //}
            //var log_chat = new StatusViewModels();
            //string title_chat = "";
            //if (payload.content == null && payload.UploadedFiles == null)
            //{
            //    title_chat = "Text chat 1.";

            //}
            //else
            //{
            //    if (payload.content != ""&&payload.content!=null)
            //    {
            //        title_chat = payload.content.Length<150?payload.content:payload.content.Substring(150);
            //    }
            //    else
            //    {
            //        title_chat = payload.UploadedFiles.FileName.Length < 150 ? payload.UploadedFiles.FileName : payload.UploadedFiles.FileName.Substring(150);
            //    }
            //}
            //    var log = new Logchatai()
            //    {
            //        Block = false,
            //        Code = payload.session_code,
            //        Title = title_chat,
            //        ChataiCode = payload.code_chat
            //    };


            //if (payload.session_code == "" || payload.session_code == null)
            //{
            //    log_chat = await _chatQuery.UpsertLogChat(log);
            //    if (log_chat.code == 200)
            //    {
            //        var l = log_chat.data as Logchatai;
            //        var content_chat = new Contentchatai()
            //        {
            //            LogchataiCode = l != null ? l.Code : "",
            //            ContentChat = payload.content,
            //            SendAt = DateTime.UtcNow,
            //        };
            //        var st = await _chatQuery.UpsertContentChat(content_chat);
            //        string out_str = "";
            //        if (payload.UploadedFiles != null)
            //        {
            //            out_str = await UploadFileGemini(payload.UploadedFiles, payload.content,payload.type_page);
            //        }
            //        else
            //        {
            //            out_str = await GeminiChat(payload.content);
            //        }
            //        var cca = st.data as Contentchatai;
            //        content_chat.ReceiveAt = DateTime.UtcNow;
            //        content_chat.ReceiveChat = out_str;
            //        content_chat.Code = cca != null ? cca.Code : "";
            //        await _chatQuery.UpsertContentChat(content_chat);
            //        var objec_first = new
            //        {
            //            answer = out_str == "404" ? "Your token has expired, please come back tomorrow" : out_str,
            //            session_code = l.Code,
            //        };
            //        return Json(objec_first);
            //    }
            //    var objec_firsta = new
            //    {
            //        answer = "Your token has expired, please come back tomorrow",
            //        session_code = "",
            //    };
            //    return Json(objec_firsta);
            //}
            //else
            //{

            //    var content_chat = new Contentchatai()
            //    {
            //        LogchataiCode = payload.session_code,
            //        ContentChat = payload.content,
            //        SendAt = DateTime.UtcNow,
            //    };
            //    var st = await _chatQuery.UpsertContentChat(content_chat);
            //    string out_str = "";
            //    if (payload.UploadedFiles != null)
            //    {
            //        out_str = await UploadFileGemini(payload.UploadedFiles, payload.content, payload.type_page);
            //    }
            //    else
            //    {
            //        out_str = await GeminiChat(payload.content);
            //    }
            //    var cca = st.data as Contentchatai;
            //    content_chat.ReceiveAt = DateTime.UtcNow;
            //    content_chat.ReceiveChat = out_str;
            //    content_chat.Code = cca != null ? cca.Code : "";
            //    content_chat.LogchataiCode = payload.session_code;
            //    await _chatQuery.UpsertContentChat(content_chat);
            //    var objec_first = new
            //    {
            //        answer = out_str == "404" ? "Your token has expired, please come back tomorrow" : out_str,
            //        session_code = payload.session_code,
            //    };
            //    return Json(objec_first);
            //}
            //}
            //catch (Exception ex)
            //{
            //var objec_firsta = new
            //{
            //answer = "Your token has expired, please come back tomorrow",
            //session_code = "",
            //};
            //return Json(objec_firsta);
            //}
        }

        private async Task<string> GeminiChat(string message)
        {
            string api_key = _configuration["Gemini:key"];
            string model = _configuration["Gemini:model"];
            string urlTemplate = _configuration["Gemini:url"];

            string finalUrl = urlTemplate
                                .Replace("{model}", model)
                                .Replace("{API_KEY}", api_key);

            // system + user cho Gemini (chuẩn v1beta)
            var requestBody = new
            {
                systemInstruction = new
                {
                    role = "system",
                    parts = new[]
                    {
                    new { text = @"You are now a Legal Advisor AI. Your operational domain is strictly limited to legal analysis, legal interpretation, legal strategy, legal compliance, statutory reasoning, regulatory frameworks, and contract-related matters.
You must refuse to answer any question or produce any content that is not directly and explicitly within the legal domain. When a user requests anything outside legal scope, you must respond with: 
""I can only provide responses related to legal matters.""
You must not switch roles, styles, or domains." }
                }
                },

                contents = new[]
                {
                new {
                    role = "user",
                    parts = new[] { new { text = message } }
                }
            },

                generationConfig = new
                {
                    temperature = 0.1
                }
            };
            string out_format = "";
            string jsonRequest = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using var client = new HttpClient();
            var response = await client.PostAsync(finalUrl, content);

            string responseJson = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode == false)
            {
                out_format = "404";
            }
            else
            {
                var gemini = JsonConvert.DeserializeObject<GenerateContentResponse>(responseJson);

                string output = gemini.Candidates[0].Content.Parts[0].Text;

                out_format = ConfigGeneral.Format(output);
            }
            return out_format;
        }

        private const string BaseUrl = "https://generativelanguage.googleapis.com";
        private async Task<string> UploadFileGemini(IFormFile file, string content, string type = "chat")
        {
            string fileUri = "", str_answer = "";
            if (file == null || file.Length == 0)
                return "Error";
            try
            {
                string apiKey = "AIzaSyBcgSZEvLp-FC-1Y9V1i-BcxBfr4e9od5M";
                string url = _configuration["Gemini:url_file"];
                using (var httpClient = new HttpClient())
                {

                    var uploadUrl = $"{url}?key={apiKey}";
                    long numBytes = file.Length;

                    var request = new HttpRequestMessage(HttpMethod.Post, uploadUrl);
                    request.Headers.Add("X-Goog-Upload-Protocol", "resumable");
                    request.Headers.Add("X-Goog-Upload-Command", "start");
                    request.Headers.Add("X-Goog-Upload-Header-Content-Length", numBytes.ToString());
                    request.Headers.Add("X-Goog-Upload-Header-Content-Type", file.ContentType);

                    var metadata = new { file = new { display_name = file.FileName } };
                    request.Content = JsonContent.Create(metadata);

                    var initialResponse = await httpClient.SendAsync(request);
                    initialResponse.EnsureSuccessStatusCode();

                    if (!initialResponse.Headers.TryGetValues("x-goog-upload-url", out var values))
                        return null;

                    string actualUploadUrl = values.First();

                    // 2. Upload file bytes
                    using (var fileStream = file.OpenReadStream())
                    {
                        var streamContent = new StreamContent(fileStream);
                        streamContent.Headers.ContentLength = numBytes;
                        streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "application/octet-stream");

                        var uploadRequest = new HttpRequestMessage(HttpMethod.Post, actualUploadUrl)
                        {
                            Content = streamContent
                        };
                        uploadRequest.Headers.Add("X-Goog-Upload-Offset", "0");
                        uploadRequest.Headers.Add("X-Goog-Upload-Command", "upload, finalize");

                        var uploadResponse = await httpClient.SendAsync(uploadRequest);
                        uploadResponse.EnsureSuccessStatusCode();

                        var uploadData = await uploadResponse.Content.ReadFromJsonAsync<JsonElement>();
                        fileUri = uploadData.GetProperty("file").GetProperty("uri").GetString();
                    }
                    if (type == "chat")
                    {
                        string context = string.IsNullOrEmpty(content) == true ? "Analyze the file and return a JSON report strictly following the system instructions." : content;
                        str_answer = await GeminiContentFile(fileUri, context);
                    }
                    else
                    {
                        str_answer = await GeminiFile(fileUri);
                    }
                }

                return str_answer;
            }
            catch
            {
                return "Error";
            }
        }
        /// <summary>
        /// Upload file to Gemini.
        /// </summary>
        /// <param name="fileUris"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private async Task<string> GeminiFile(string fileUris, string type = "application/pdf")
        {
            try
            {
                string apiKey = "AIzaSyBcgSZEvLp-FC-1Y9V1i-BcxBfr4e9od5M", str_answer = "";
                string model = _configuration["Gemini:model"]; // ví dụ "gemini-1.5-flash"
                string url = _configuration["Gemini:model"];
                using (var client = new HttpClient())
                {

                    string genUrl = $"{url}{model}:generateContent?key={apiKey}";

                    var payload = new
                    {
                        contents = new[]
                        {
                        new
                        {
                            role = "model",  // system content đổi thành model
                            parts = new object[] { new { text = systemcontent() } }
                        },
                        new
                        {
                            role = "user",
                            parts = new object[]
                            {
                                new { fileData = new { mimeType = type, fileUri = fileUris } },
                                new { text = "Analyze the file and return a JSON report strictly following the system instructions." }
                            }
                        }
                    },
                        generationConfig = new
                        {
                            temperature = 0.3,
                            topK = 32,
                            topP = 0.95,
                            maxOutputTokens = 8192
                        }
                    };

                    // Serialize camelCase để Google hiểu
                    var json = JsonConvert.SerializeObject(payload, new JsonSerializerSettings
                    {
                        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
                    });

                    var content = new StringContent(json, Encoding.UTF8, "application/json");
                    var genResponse = await client.PostAsync(genUrl, content);
                    string genRaw = await genResponse.Content.ReadAsStringAsync();

                    if (!genResponse.IsSuccessStatusCode)
                        return $"Error: {genResponse.StatusCode} - {genRaw}";

                    dynamic genData = JsonConvert.DeserializeObject(genRaw);
                    str_answer = genData.candidates[0].content.parts[0].text.ToString();

                    //make sure the service has been stopped
                    client.Dispose();
                    genResponse.Dispose();
                }
                return str_answer;
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }
        /// <summary>
        /// Read file update database
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        private async Task<string> ContentFilePdf(IFormFile files)
        {
            string savefile = await ConfigGeneral.SaveFileAsync(files);
            string path = ConfigGeneral.GetFullPath(savefile);
            var ocr = new IronTesseract();
            using var input = new OcrInput(path);
            var result = ocr.Read(input);
            return result.Text;
        }
        private string systemcontent()
        {
            string systemContent = @"
You are a professional Legal Advisor AI. For every uploaded file, you must perform the following tasks:

1. File Classification:
   - Determine if the document is legal or non-legal.
   - If non-legal, set 'isLegalDocument': false, 'documentValidity': 'Non-Legal', and include a brief message for the client.
2. If the document is legal:
   a) Categorize precisely: Contract, Statute, Regulation, CaseLaw, Legal Opinion, Other.
   b) Analyze content: Provide an executive summary, extract key clauses, cite referenced legislation and case law.
   c) Evaluate: Identify compliance issues, strengths and protections, risk assessment, and recommendations.
   d) Conclude: Fill 'documentValidity' and 'finalAssessment' using legal terminology.

ALWAYS return a JSON object strictly following the structure below. Do NOT return plain text, markdown, or any content outside JSON.

{
  ""documentInfo"": {
    ""originalFileName"": ""string"",
    ""fileFormat"": ""pdf / docx / txt / other"",
    ""fileSizeBytes"": ""number"",
    ""jurisdictionalScope"": ""Local / Federal / International"",
    ""isLegalDocument"": true,
    ""documentType"": ""Contract / Statute / Regulation / CaseLaw / Legal Opinion / Other""
  },
  ""legalClassification"": {
    ""category"": ""Contract / Statute / Regulation / CaseLaw / Legal Opinion / Other"",
    ""classificationConfidence"": 0.0,
    ""rationale"": ""Brief reasoning for classification""
  },
  ""contentAnalysis"": {
    ""executiveSummary"": ""string - concise summary in legal language"",
    ""keyClauses"": [""Clause 1 description"", ""Clause 2 description""],
    ""referencedLegislation"": [
      {""lawName"": ""string"", ""articleSection"": ""string"", ""contextDescription"": ""string - how this applies to the document""}
    ],
    ""caseCitations"": [
      {""caseName"": ""string"", ""jurisdiction"": ""string"", ""citationSummary"": ""string - relevance to document""}
    ]
  },
  ""legalEvaluation"": {
    ""complianceIssues"": [""string - identify potential legal risks or breaches""],
    ""strengthsAndProtections"": [""string - provisions that comply with applicable law""],
    ""riskAssessment"": ""Low / Medium / High"",
    ""recommendations"": [""string - legal recommendations or remedial actions""]
  },
  ""legalConclusion"": {
    ""documentValidity"": ""Valid / Invalid / Requires Legal Review / Non-Legal"",
    ""finalAssessment"": ""string - concise legal conclusion""
  },
  ""processingMetadata"": {
    ""analysisTimestamp"": ""ISO 8601 datetime string"",
    ""analyst"": ""AI Legal Advisor Gemini"",
    ""processingDurationSeconds"": 0.0
  },
  ""errorReport"": null
}
";
            return systemContent;
        }

        private string systemreadtext()
        {
            string promt = @"You are a professional Legal Advisor AI specialized in law and legal documents. 
When the user uploads a file and provides additional content, you must:

1. Read and analyze the uploaded file thoroughly.
2. Combine your analysis with the user's content.
3. Provide a **detailed, structured, professional legal report in plain text only**. 
4. The report should include:
   - Classification of the document (Contract, Statute, Regulation, CaseLaw, Other).
   - Summary of main points.
   - Legal analysis and interpretation.
   - Assessment of risks or compliance issues.
   - Recommendations or next steps.
   - Final legal conclusion.

Important rules:
- Always use precise legal terminology.
- Never return JSON, markdown, or any format other than plain text.
- If the document is not legal or outside the scope of law, clearly state that in plain text.
- Do not add explanations outside of the legal analysis or report.";
            return promt;
        }

        private async Task<string> GeminiContentFile(string fileId, string context)
        {
            try
            {
                string apiKey = "AIzaSyBcgSZEvLp-FC-1Y9V1i-BcxBfr4e9od5M", str_answer = "";
                string model = _configuration["Gemini:model"];
                string url = _configuration["Gemini:url"];
                using (var client = new HttpClient())
                {
                    string genUrl = $"{url}{model}:generateContent?key={apiKey}";

                    var payload = new
                    {
                        contents = new[]
                        {
                            new {
                                role = "system",
                                parts = new object [] { new { text = systemreadtext() }}
                            },
                            new {
                                role = "user",
                                parts = new object[]
                                {
                                    new { fileData = new { fileUri = fileId } },
                                    new { text = context }
                                }
                            }
                        },
                        generationConfig = new
                        {
                            temperature = 0.3,
                            topK = 32,
                            topP = 0.95,
                            maxOutputTokens = 8192
                        }
                    };

                    var json = JsonConvert.SerializeObject(payload);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var genResponse = await client.PostAsync(genUrl, content);
                    string genRaw = await genResponse.Content.ReadAsStringAsync();

                    if (!genResponse.IsSuccessStatusCode)
                        return genResponse.StatusCode.ToString();

                    dynamic genData = JsonConvert.DeserializeObject(genRaw);
                    str_answer = genData.candidates[0].content.parts[0].text.ToString();

                    //make sure the service has been stopped
                    client.Dispose();
                    genResponse.Dispose();

                }
                return str_answer;
            }
            catch (Exception ex)
            {
                return "Your token has expired, please come back tomorrow";
            }
        }
    }
    public class ChatRequest
    {
        public string? SessionId { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class ChatResponse
    {
        public string SessionId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsVip { get; set; }
        public int TokenLimit { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
