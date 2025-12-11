using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace Cms.Legal.Areas.SystemAreas
{
    public static class RsaKeyUtils
    {
        public static RsaSecurityKey GetPrivateKeyFromPem(string pemPath)
        {
            var pem = File.ReadAllText(pemPath).Trim();
            using var rsa = RSA.Create();
            rsa.ImportFromPem(pem.ToCharArray());
            return new RsaSecurityKey(rsa);
        }

        public static RsaSecurityKey GetPublicKeyFromPem(string pemPath)
        {
            var pem = File.ReadAllText(pemPath).Trim();
            using var rsa = RSA.Create();
            rsa.ImportFromPem(pem.ToCharArray());
            return new RsaSecurityKey(rsa);
        }
    }
}
