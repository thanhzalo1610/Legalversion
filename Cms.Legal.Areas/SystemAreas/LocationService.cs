using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.SystemAreas
{
    public class LocationService
    {
        private readonly HttpClient _http;
        private readonly MemoryCache _cache = new(new MemoryCacheOptions());

        public LocationService(HttpClient http)
        {
            _http = http;
        }

        public async Task<object> LookupAsync(string ip)
        {
            if (string.IsNullOrWhiteSpace(ip)) return null;

            if (_cache.TryGetValue(ip, out object cached))
                return cached;

            object location = await TryProviders(ip);

            if (location != null)
            {
                _cache.Set(ip, location, TimeSpan.FromHours(6));
            }

            return location;
        }

        private async Task<object> TryProviders(string ip)
        {
            var providers = new[]
            {
            $"https://ipapi.co/{ip}/json/",
            $"https://ipinfo.io/{ip}/json"
        };

            foreach (var url in providers)
            {
                var result = await SafeCall(url);
                if (result != null) return result;
            }

            return null;
        }

        private async Task<object> SafeCall(string url)
        {
            try
            {
                using var req = new HttpRequestMessage(HttpMethod.Get, url);
                var rsp = await _http.SendAsync(req);

                if (!rsp.IsSuccessStatusCode) return null;

                var json = await rsp.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json);
            }
            catch
            {
                return null;
            }
        }
    }
}
