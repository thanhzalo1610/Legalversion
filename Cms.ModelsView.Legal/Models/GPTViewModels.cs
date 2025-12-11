using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.ModelsView.Legal.Models
{
    public class GPTViewModels
    {
        public class GenerateContentRequest
        {
            [JsonProperty("contents")]
            public List<Content> Contents { get; set; }

            [JsonProperty("generationConfig")]
            public GenerationConfig GenerationConfig { get; set; } // Sửa tên từ Config -> GenerationConfig
        }

        public class GenerationConfig
        {
            [JsonProperty("temperature")]
            public double Temperature { get; set; }
        }

        public class Content
        {
            [JsonProperty("role")]
            public string Role { get; set; }

            [JsonProperty("parts")]
            public List<Part> Parts { get; set; }
        }

        public class Part
        {
            [JsonProperty("text")]
            public string Text { get; set; }
        }

        // =============== II. MODEL NHẬN VỀ (RESPONSE) ===============
        public class Candidate
        {
            [JsonProperty("content")]
            public Content Content { get; set; }
        }

        public class GenerateContentResponse
        {
            [JsonProperty("candidates")]
            public List<Candidate> Candidates { get; set; }
        }
    }
}
