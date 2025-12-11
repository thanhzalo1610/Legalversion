// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using Cms.Legal.Areas.QueryData;
using Cms.Legal.Areas.SystemAreas;
using Cms.Legal.Web.Data;
using Cms.ModelsView.Legal.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Cms.Legal.Web.Areas.Identity.Pages.Account
{
    public class LoginModel : PageModel
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<LoginModel> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AccountQuery _accountQuery;
        private readonly MenuQuery _menuQuery;
        private readonly SecureCookieCrypto _crypto;
        private readonly Cms.Legal.Web.Middleware.JwtService _jwtService;
        public LoginModel(SignInManager<ApplicationUser> signInManager, ILogger<LoginModel> logger,UserManager<ApplicationUser> userManager, Cms.Legal.Web.Middleware.JwtService jwtService, AccountQuery accountQuery, MenuQuery menuQuery, SecureCookieCrypto secureCookieCrypto)
        {
            _signInManager = signInManager;
            _logger = logger;
            _userManager = userManager; 
            _accountQuery = accountQuery;
            _crypto = secureCookieCrypto;  
            _menuQuery=menuQuery;
            _jwtService=jwtService;
        }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [BindProperty]
        public InputModel Input { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public string ReturnUrl { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [TempData]
        public string ErrorMessage { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public class InputModel
        {
            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Required]
            [MinLength(5,ErrorMessage = "Insufficient account characters.")]
            public string Email { get; set; }

            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
        }

        public async Task OnGetAsync(string returnUrl = null)
        {
            if (!string.IsNullOrEmpty(ErrorMessage))
            {
                ModelState.AddModelError(string.Empty, ErrorMessage);
            }

            returnUrl ??= Url.Content("~/");

            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            ReturnUrl = returnUrl;
        }
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            if (Input.Email.Contains("@") == true)
            {
                if (IsValidEmail(Input.Email))
                {
                    ModelState.AddModelError(string.Empty, "Incorrect email format.");
                    return Page();
                }
            }
            returnUrl ??= Url.Content("~/");

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            if (ModelState.IsValid)
            {
                var user = Input.Email.Contains("@")==true?await _userManager.FindByEmailAsync(Input.Email):await _userManager.FindByNameAsync(Input.Email);
                if (user == null)
                {
                    ModelState.AddModelError(string.Empty, "Account does not exist. Register before logging in.");
                    return Page();
                }
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(user.UserName, Input.Password, Input.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var guestCookie = Request.Cookies["client_info"];
                    if (!string.IsNullOrEmpty(guestCookie))
                    {
                        var jsons = _crypto.Decrypt(guestCookie);
                        var guestData = JsonSerializer.Deserialize<SessionContactViewModels>(jsons);

                        // Merge guest data vào user thật
                        await _accountQuery.GetSessionContact(user.Id);
                        var jwt = _jwtService.GenerateToken(user);

                        Response.Cookies.Append("CLIENT_TOKEN", jwt, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.Strict,
                            Expires = Input.RememberMe
                                ? DateTimeOffset.UtcNow.AddDays(1)
                                : DateTimeOffset.UtcNow.AddMinutes(15)
                        });

                        var client_info = await _accountQuery.GetSessionContact(user.Id);
                        var json = JsonSerializer.Serialize(client_info);
                        var enc = _crypto.Encrypt(json);
                        Response.Cookies.Append("client_info", enc, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.Strict,
                            Expires = DateTimeOffset.UtcNow.AddHours(1)
                        });
                    }
                    _logger.LogInformation("User logged in.");
                    return LocalRedirect(returnUrl);
                }
                if (result.RequiresTwoFactor)
                {
                    return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, RememberMe = Input.RememberMe });
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User account locked out.");
                    return RedirectToPage("./Lockout");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    return Page();
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
        private bool IsValidEmail(string email)
        {
            // Regex kiểm tra định dạng email cơ bản: user@domain.tld
            const string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, emailPattern, RegexOptions.IgnoreCase);
        }
    }

}
