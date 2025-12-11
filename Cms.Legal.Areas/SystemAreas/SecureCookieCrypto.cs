using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.SystemAreas
{
    public class SecureCookieCrypto
    {
        private readonly byte[] _key;

        public SecureCookieCrypto(IConfiguration config)
        {
            var keyBase64 = "cVDSU8K3aBcCfqiLBMxpZ9VEde1PW4ZP1/481EY/PIQ=";
            if (string.IsNullOrEmpty(keyBase64))
                throw new ArgumentException("Missing Security:ClientDataKey in configuration.");

            try
            {
                _key = Convert.FromBase64String(keyBase64);
            }
            catch
            {
                throw new ArgumentException("ClientDataKey must be a valid Base64 string.");
            }

            if (_key.Length != 32)
                throw new ArgumentException("ClientDataKey must be 32 bytes for AES-256.");
        }

        public string Encrypt(string plain)
        {
            using var aes = Aes.Create();
            aes.Key = _key;
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor();
            var plainBytes = Encoding.UTF8.GetBytes(plain);
            var encrypted = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            var result = Convert.ToBase64String(aes.IV.Concat(encrypted).ToArray());
            return result;
        }

        public string Decrypt(string cipher)
        {
            var full = Convert.FromBase64String(cipher);
            var iv = full.Take(16).ToArray();
            var data = full.Skip(16).ToArray();

            using var aes = Aes.Create();
            aes.Key = _key;
            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor();
            var decrypted = decryptor.TransformFinalBlock(data, 0, data.Length);
            return Encoding.UTF8.GetString(decrypted);
        }
    }
}
