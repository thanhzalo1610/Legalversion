using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Cms.Legal.Areas.SystemAreas
{
    public class JwtServiceGuest 
    {
        private readonly RSA _privateKey;
        private readonly RSA _publicKey;

        public JwtServiceGuest(string privateKeyPath, string publicKeyPath)
        {
            _privateKey = RSA.Create();
            _privateKey.ImportFromPem(File.ReadAllText(privateKeyPath));

            _publicKey = RSA.Create();
            _publicKey.ImportFromPem(File.ReadAllText(publicKeyPath));
        }

        public string GenerateToken(string user="Guest",string ip="")
        {
            var creds = new SigningCredentials(new RsaSecurityKey(_privateKey), SecurityAlgorithms.RsaSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user),
            new Claim("ip", ip),
        };

            var token = new JwtSecurityToken(
                issuer: "secure-app",
                audience: "secure-client",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParams = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                RequireExpirationTime = true,
                ValidateLifetime = true,
                IssuerSigningKey = new RsaSecurityKey(_publicKey),
                ValidateIssuerSigningKey = true
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParams, out var validatedToken);
                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
