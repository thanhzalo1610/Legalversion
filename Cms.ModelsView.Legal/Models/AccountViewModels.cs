using Cms.DataNpg.Legal.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.ModelsView.Legal.Models
{
    public class AccountViewModels
    {
        public string user_id {  get; set; }
        public string user_name { get; set; }
        public string image { get;set; }
        public string full_name { get; set; }
        public string email { get; set; }
        public Boolean Confirm_email { get; set; }
        public Boolean confirm_phone { get; set; }
        public string role_name { get; set; }
        public string role_id { get; set; }
    }
    public class ManagerProfileViewModels
    {
        public string full_name { get; set; }

        public string job_name { get; set; }

        public string Image { get; set; }

        public string CodeUser { get; set; }

        public string PhoneNumber { get; set; }

        public DateOnly? BirthDate { get; set; }= new DateOnly();
        public AddressUser address { get; set; }=new AddressUser();
        public Lawyer law { get; set; }=new Lawyer();
    }
    public class SessionContactViewModels
    {
        public string user_name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string image { get; set; } = "/images/users/user_default.png";
        public string role { get; set; } = "Guest";
        public string rank { get; set; } = string.Empty;
        public string level { get; set; } = string.Empty;
        public string? GuestId { get; set; }
        public GuestSessionViewModels GuestSession { get; set; }=new GuestSessionViewModels();
    }
    public class GuestSessionViewModels
    {
        public string AppName { get; set; }
        public string DeviceUser { get; set; }
        public string? IpUser { get; set; }
        public string RoleUser { get; set; }
        public string NickName { get; set; }
        public string UserId { get; set; }
    }
}
