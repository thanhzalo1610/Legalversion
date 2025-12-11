using Cms.DataNpg.Legal.EF;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Emit;

namespace Cms.Legal.Web.Data
{
    public class ApplicationUser : IdentityUser
    {
        [DataType(DataType.Text)]
        [MaxLength(150)]
        public string FisrtName { get; set; }
        [DataType(DataType.Text)]
        [MaxLength(150)]
        public string LastName { get; set; }
        [DataType(DataType.Text)]
        [MaxLength(300)]
        public string FullName { get; set; }
        public DateOnly BirthDate { get; set; }
        [DataType(DataType.Text)]
        public string Image { get; set; }
        [DataType(DataType.Text)]
        [MaxLength(100)]
        public string CodeUser { get; set; }
    }
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
