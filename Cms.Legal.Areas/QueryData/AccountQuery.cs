using Cms.DataNpg.Legal.EF;
using Cms.ModelsView.Legal.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.QueryData
{
    public class AccountQuery
    {
        private readonly LegalDbContext _db;

        public AccountQuery(LegalDbContext db)
        {
            _db = db;
        }

        public async Task<List<AccountViewModels>> ListALlAccount(string role = "admin")
        {
            var list = new List<AccountViewModels>();
            try
            {
                if (role.ToLower() == "admin")
                {
                    var get_list = await (from d in _db.AspNetUsers.AsNoTracking()
                                          join ru in _db.AspNetUserRoles on d.Id equals ru.UserId
                                          join r in _db.AspNetRoles on ru.RoleId equals r.Id
                                          select new AccountViewModels
                                          {
                                              user_id = ru.UserId,
                                              user_name = d.UserName,
                                              full_name = d.FullName,
                                              confirm_phone = d.PhoneNumberConfirmed,
                                              Confirm_email = d.EmailConfirmed,
                                              email = d.Email,
                                              image = d.Image,
                                              role_id = ru.RoleId,
                                              role_name = r.Name,
                                          }).ToDynamicListAsync();
                    if (get_list != null && get_list.Count() > 0)
                    {
                        foreach (var item in get_list)
                        {
                            list.Add(item);
                        }

                    }
                    return list;

                }
                if (role.ToLower() == "superadmin")
                {
                    var get_list = await (from d in _db.AspNetUsers.AsNoTracking()
                                          join ru in _db.AspNetUserRoles on d.Id equals ru.UserId
                                          join r in _db.AspNetRoles on ru.RoleId equals r.Id
                                          select new AccountViewModels
                                          {
                                              user_id = ru.UserId,
                                              user_name = d.UserName,
                                              full_name = d.FullName,
                                              confirm_phone = d.PhoneNumberConfirmed,
                                              Confirm_email = d.EmailConfirmed,
                                              email = d.Email,
                                              image = d.Image,
                                              role_id = ru.RoleId,
                                              role_name = r.Name,
                                          }).ToDynamicListAsync();
                    if (get_list != null && get_list.Count() > 0)
                    {
                        foreach (var item in get_list)
                        {
                            list.Add(item);
                        }

                    }
                    return list;

                }
                if (role.ToLower() != "superadmin"|| role.ToLower() != "admin")
                {
                    var get_list = await (from d in _db.AspNetUsers.AsNoTracking()
                                          join ru in _db.AspNetUserRoles on d.Id equals ru.UserId
                                          join r in _db.AspNetRoles on ru.RoleId equals r.Id
                                          where r.Name==role
                                          select new AccountViewModels
                                          {
                                              user_id = ru.UserId,
                                              user_name = d.UserName,
                                              full_name = d.FullName,
                                              confirm_phone = d.PhoneNumberConfirmed,
                                              Confirm_email = d.EmailConfirmed,
                                              email = d.Email,
                                              image = d.Image,
                                              role_id = ru.RoleId,
                                              role_name = r.Name,
                                          }).ToDynamicListAsync();
                    if (get_list != null && get_list.Count() > 0)
                    {
                        foreach (var item in get_list)
                        {
                            list.Add(item);
                        }

                    }
                    return list;

                }
                return list;
            }
            catch
            {
                return list;
            }
        }
        public async Task<ManagerProfileViewModels>GetProfile(string user_id)
        {
            var get = new ManagerProfileViewModels();
            try
            {
                var search = await (from d in _db.AspNetUsers.AsNoTracking()
                                    join la in _db.Lawyers.AsNoTracking() on d.CodeUser equals la.UserId
                                    join a in _db.AddressUsers.AsNoTracking() on d.CodeUser equals a.UserId
                                    where d.CodeUser == user_id && la.UserId == user_id && a.UserId == user_id
                                    select new ManagerProfileViewModels
                                    {
                                        full_name = d.FullName,
                                        address = a,
                                        law = la,
                                        BirthDate = d.BirthDate,
                                        CodeUser = d.CodeUser,
                                        Image = d.Image,
                                        PhoneNumber = d.PhoneNumber,
                                    }).ToDynamicListAsync();
                if(search.Count > 0)
                {
                    get = search.FirstOrDefault();
                }
                return get;
            }
            catch
            {
                return get;
            }
        }
        public async Task<List<AspNetUser>> ListMenuSelect()
        {
            var list = await _db.AspNetUsers.AsNoTracking().OrderByDescending(m => m.UserName).ToDynamicListAsync();
            var get=new List<AspNetUser>();
            foreach (var item in list)
            {
                get.Add(item);
            }
            return get;
        }
        public async Task<SessionContactViewModels> GetSessionContact(string user_id = "")
        {
            var get = new SessionContactViewModels();
            try
            {
                get = await (from a in _db.AspNetUsers.AsNoTracking()
                               join m in _db.AspNetUserRoles.AsNoTracking() on a.Id equals m.UserId
                               join r in _db.AspNetRoles.AsNoTracking() on m.RoleId equals r.Id
                               where a.Id == user_id
                               select new SessionContactViewModels
                               {
                                   user_name = a.CodeUser,
                                   email = a.Email,
                                   image = a.Image,
                                   level ="Nan",
                                   rank="Nan",
                                   role=r.Name,
                               }).FirstOrDefaultAsync();
                return get;
            }
            catch
            {
                return get;
            }
        }
    }
}
