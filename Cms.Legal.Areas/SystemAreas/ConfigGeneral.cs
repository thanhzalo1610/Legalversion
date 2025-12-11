using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.SystemAreas
{
    public static class ConfigGeneral
    {
        public static string CodeData(string fisrt_code = "MOBL")
        {
            DateTimeOffset dateTimeOffset = new DateTimeOffset(DateTime.Now);
            var time_code = dateTimeOffset.ToUnixTimeMilliseconds().ToString();
            return fisrt_code + time_code;
        }
        public static string TextDefault(string text = "")
        {
            if (text == "" || text == null)
            {
                text = "Title default";
            }
            return text.Trim();
        }
        private static string rege = "!@#$%^&*()_+;:'\"/.,}{[]~`?><|=";
        public static string ConvertToUnsign(string strInput)
        {
            var ea = rege.ToArray();
            foreach (var item in ea)
            {
                strInput = strInput.Replace(item.ToString(), "");
            }
            string intput_white = strInput.Replace(" ", "-");
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = intput_white.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D').ToLower();
        }
        public static string ConvertToUn(string strInput)
        {
            string intput_white = strInput.Replace(" ", "-");
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = intput_white.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D').ToLower();
        }
        public static string Format(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;

            // Normalize newline
            var text = input.Replace("\r\n", "\n").Replace("\r", "\n");

            // Escape HTML để an toàn khi render
            text = System.Net.WebUtility.HtmlEncode(text);

            // Chuẩn hóa tab -> indent 4 space
            text = text.Replace("\t", "    ");

            // Chuẩn hóa bullet list Markdown: -, *, +
            text = Regex.Replace(text, @"^\s*[\-\*\+]\s+", "• ", RegexOptions.Multiline);

            // Chuẩn hóa numbering list: 1) 2. 3 - => 1. 2. 3.
            text = Regex.Replace(text, @"^\s*(\d+)[\)\.\-]\s+", "$1. ", RegexOptions.Multiline);

            // Nếu thụt lề bằng 4 space => tạo class indent trong HTML
            text = Regex.Replace(text, @"^( {4,})", m =>
            {
                var indentLevel = m.Value.Length / 4;
                return $"[indent:{indentLevel}]";
            }, RegexOptions.Multiline);

            // Tách đoạn
            var paragraphs = Regex.Split(text, @"\n{2,}")
                .Where(p => !string.IsNullOrWhiteSpace(p))
                .Select(p =>
                {
                    // Xử lý indent bên trong đoạn
                    var html = p.Replace("\n", "<br>");

                    html = Regex.Replace(html, @"\[indent:(\d+)\]", m =>
                    {
                        var lvl = int.Parse(m.Groups[1].Value);
                        return $"<span style=\"margin-left:{lvl * 20}px; display:inline-block\"></span>";
                    });

                    return $"<p>{html.Trim()}</p>";
                });

            return string.Join("\n", paragraphs);
        }
        public static async Task<dynamic> GetLocationByIpAsync(string ip)
        {
            using var http = new HttpClient();
            var json = await http.GetStringAsync($"https://ipapi.co/{ip}/json/");
            return JsonSerializer.Deserialize<dynamic>(json);
        }
        private static readonly string BaseFolder = "/var/tmp/ocr-files";

        /// <summary>
        /// Lưu file upload vào folder cố định
        /// </summary>
        /// <param name="file">File upload</param>
        /// <returns>Tên file đã lưu (không kèm path)</returns>
        public static async Task<string> SaveFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File trống hoặc null", nameof(file));

            // Tên file ngẫu nhiên + extension
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string fullPath = Path.Combine(BaseFolder, fileName);

            await using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            return fileName; // chỉ trả tên file
        }

        /// <summary>
        /// Lấy file từ folder cố định bằng tên file
        /// </summary>
        /// <param name="fileName">Tên file đã lưu</param>
        /// <returns>Byte array file</returns>
        public static byte[] GetFile(string fileName)
        {
            string fullPath = Path.Combine(BaseFolder, fileName);
            if (!File.Exists(fullPath))
                throw new FileNotFoundException("File không tồn tại", fullPath);

            return File.ReadAllBytes(fullPath);
        }

        /// <summary>
        /// Lấy full path file từ folder cố định
        /// </summary>
        public static string GetFullPath(string fileName)
        {
            return Path.Combine(BaseFolder, fileName);
        }

        /// <summary>
        /// Xóa file khỏi folder cố định
        /// </summary>
        public static void DeleteFile(string fileName)
        {
            string fullPath = Path.Combine(BaseFolder, fileName);
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }
    }
}
