using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.ModelsView.Legal.Models
{
    public class SercurityModels
    {
    }
    public class JwtSettings
    {
        public string Issuer { get; set; } = default!;
        public string Audience { get; set; } = default!;
        public int AccessTokenLifetimeMinutes { get; set; }
        public int RefreshTokenLifetimeDays { get; set; }
        public string PrivateKeyPath { get; set; } = default!;
        public string PublicKeyPath { get; set; } = default!;
    }
}
