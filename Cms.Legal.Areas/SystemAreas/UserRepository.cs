using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.SystemAreas
{
    public interface IUserRepository
    {
        Task<IdentityUser?> GetUserByIdAsync(string id);
        Task<IdentityUser?> GetUserByEmailAsync(string email);
    }

    public class UserRepository : IUserRepository
    {
        private readonly UserManager<IdentityUser> _userManager;
        public UserRepository(UserManager<IdentityUser> userManager) => _userManager = userManager;

        public async Task<IdentityUser?> GetUserByIdAsync(string id) =>
            await _userManager.FindByIdAsync(id);

        public async Task<IdentityUser?> GetUserByEmailAsync(string email) =>
            await _userManager.FindByEmailAsync(email);
    }
}
