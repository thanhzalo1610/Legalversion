using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.SystemAreas;
using Cms.ModelsView.Legal.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.DynamicLinq;
using System.Linq.Dynamic.Core;
using System.Numerics;

namespace Cms.Legal.Areas.QueryData
{
    public class MenuQuery
    {
        private readonly LegalDbContext _db;

        public MenuQuery(LegalDbContext db)
        {
            _db = db;
        }

        public async Task<List<Menu>> ListAllMenu()
        {
            var list=new List<Menu>();
            try
            {
                var get=await _db.Menus.AsNoTracking().OrderBy(m=>m.CreateAt).ToDynamicListAsync();
                foreach (var menu in get)
                {
                    list.Add(menu);
                }

                return list;
            }
            catch
            {
                return list;
            }
        }
        public async Task<List<MenuDe>> ListMenuDes(string id="")
        {
            var list = new List<MenuDe>();
            try
            {
                var get = await _db.MenuDes.AsNoTracking().Where(m=>m.MenuCode==id).ToDynamicListAsync();
                foreach (var de in get)
                {
                    list.Add(de);
                }
                return list;
            }
            catch
            {
                return list;
            }
        }
        public async Task<List<MenuDe>> ListMenuParent(string id = "",string menucode="")
        {
            var list = new List<MenuDe>();
            try
            {
                var get = await _db.MenuDes.AsNoTracking().Where(m => m.MenuCode == menucode&&m.Code!=id).ToDynamicListAsync();
                foreach (var de in get)
                {
                    list.Add(de);
                }
                return list;
            }
            catch
            {
                return list;
            }
        }
        public async Task<StatusViewModels> UpsertMenu(Menu model)
        {
            var st = new StatusViewModels();
            try
            {
                var is_title =  _db.Menus.AsNoTracking().Where(m => m.Title.StartsWith( model.Title));
                    if (is_title.Any()==true)
                    {
                        model.Title += is_title.Count() + 1;
                    }
                if (model.Code != "Nan" && model.Code != null && model.Code != "")
                {
                   var get= await _db.Menus.AsNoTracking().SingleOrDefaultAsync(m=>m.Code== model.Code);
                    if(get!= null)
                    {
                        get.Title=ConfigGeneral.TextDefault(model.Title);
                        get.UpdateAt = DateTime.UtcNow;
                        get.ActiveStatus = 2;
                        get.TitleActive = "Edit succes";
                        _db.Menus.Update(get);
                        await _db.SaveChangesAsync();

                        st.code = 200;
                        st.message = "Edit menu success.";
                        st.title = "Menu.";
                        st.data = get;
                        st.status = "success";
                    }
                    else
                    {
                        st.code = 500;
                        st.message = "Reload the page or check your network connection before proceeding.";
                        st.title = "Menu.";
                        st.data = get;
                        st.status = "warning";
                    }
                }
                else
                {
                    
                    var m = new Menu();
                    m.Code = ConfigGeneral.CodeData("MPES");
                    m.Status = true;
                    m.Title = ConfigGeneral.TextDefault(model.Title);
                    m.CreateAt = DateTime.UtcNow;
                    m.ActiveStatus = 1;
                    m.TitleActive = "Success";
                    _db.Menus.Add(m);
                    _db.SaveChanges();
                    st.code = 200;
                    st.message = "Add new success.";
                    st.title = "Menu.";
                    st.data = m;
                    st.status = "success";
                }
                return st;
            }
            catch
            {
                st.code = 404;
                st.message = "The system is handling high traffic, please try again in a moment.";
                st.title = "Legal AI.";
                st.status = "error";
                return st;
            }
        }
        public async Task<StatusViewModels>UpsertMenuDes(MenuDe model)
        {
            var st=new StatusViewModels();
            try
            {
                var is_title = _db.MenuDes.AsNoTracking().Where(m => m.Title.StartsWith(model.Title));
                if (is_title.Any() == true)
                {
                    model.Title += is_title.Count() + 1;
                }
                if (model.Code != null && model.Code != "")
                {
                    var get =await _db.MenuDes.AsNoTracking().SingleOrDefaultAsync(m => m.Code == model.Code);
                    if (get != null)
                    {
                        get.Title=ConfigGeneral.TextDefault(model.Title);
                        get.UpdateAt = DateTime.UtcNow;
                        get.Slug=ConfigGeneral.ConvertToUnsign(get.Title);
                        get.Url = model.Url;
                        get.TypeField = ConfigGeneral.TextDefault(model.TypeView);
                        get.ValueField = ConfigGeneral.TextDefault(model.ValueField);
                        get.MenuCode=model.MenuCode;
                        _db.MenuDes.Update(get);
                        _db.SaveChanges();
                        st.code = 200;
                        st.message = "Edit menu success.";
                        st.title = "Menu.";
                        st.data = get;
                        st.status = "success";
                    }
                    else
                    {
                        st.code = 500;
                        st.message = "Reload the page or check your network connection before proceeding.";
                        st.title = "Menu.";
                        st.data = get;
                        st.status = "warning";
                    }
                }
                else
                {
                    var m = new MenuDe();
                    m.Code = ConfigGeneral.CodeData("MMOS");
                    m.Title= model.Title;
                    m.CreateAt = DateTime.UtcNow;
                    m.Slug = ConfigGeneral.ConvertToUnsign(m.Title);
                    m.Url = m.Url;
                    m.TypeField = ConfigGeneral.TextDefault(model.TypeField);
                    m.ValueField = ConfigGeneral.TextDefault(model.ValueField);
                    m.MenuCode = model.MenuCode;
                    m.TypeView = model.TypeView??"layout";

                    _db.MenuDes.Add(m);
                    _db.SaveChanges();

                    st.code = 200;
                    st.message = "Add new success.";
                    st.title = "Menu.";
                    st.data = m;
                    st.status = "success";
                }
                return st;
            }
            catch
            {
                st.code = 404;
                st.message = "The system is handling high traffic, please try again in a moment.";
                st.title = "Legal AI.";
                st.status = "error";
                return st;
            }
        }

        public async Task<StatusViewModels> DeletedMenu(string[] id = null)
        {
            var st = new StatusViewModels();
            try
            {
                foreach(var item in id)
                {
                    var get =await _db.Menus.SingleOrDefaultAsync(m => m.Code == item);
                    if(get!= null)
                    {
                        _db.Menus.Remove(get);
                    }
                }
                 st.code = 200;
                st.message = "Menu was deleted successfully.";
                st.title = "Deleted menu.";
                st.status = "success";
                return st;
            }
            catch
            {
                st.code = 404;
                st.message = "The system is handling high traffic, please try again in a moment.";
                st.title = "Legal AI.";
                st.status = "error";
                return st;
            }
        }
        public async Task<StatusViewModels> DeletedMenuDes(string[] id = null)
        {
            var st = new StatusViewModels();
            try
            {
                foreach (var item in id)
                {
                    var get = await _db.MenuDes.SingleOrDefaultAsync(m => m.Code == item);
                    if (get != null)
                    {
                        _db.MenuDes.Remove(get);
                    }
                }
                st.code = 200;
                st.message = "Menu was deleted successfully.";
                st.title = "Deleted menu.";
                st.status = "success";
                return st;
            }
            catch
            {
                st.code = 404;
                st.message = "The system is handling high traffic, please try again in a moment.";
                st.title = "Legal AI.";
                st.status = "error";
                return st;
            }
        }
        public async Task<Menu>GetMenu(string id = "")
        {
            var m = new Menu();
            try
            {
                m=await _db.Menus.SingleOrDefaultAsync(m=>m.Code== id);
                return m;
            }
            catch
            {
                return m;
            }
        }
        public async Task<MenuDe> GetMenuDes(string id = "")
        {
            var m = new MenuDe();
            try
            {
                m = await _db.MenuDes.SingleOrDefaultAsync(m => m.Code == id);
                return m;
            }
            catch
            {
                if (!string.IsNullOrEmpty(id))
                {
                    m.MenuCode= id;
                }
                return m;
            }
        }
        public async Task<MenuRole> GetMenuRole(string id = "")
        {
            var list=new MenuRole();
            try
            {
                var get=await (from n  in _db.MenuRoles
                               where n.Code== id
                               select n).ToDynamicListAsync();

                list = get.FirstOrDefault();
                return list;
            }
            catch
            {
                return list;
            }
        }
        public async Task<StatusViewModels>UpsertMenuRole(MenuRoleViewModels model)
        {
            var st=new StatusViewModels();
            try
            {
                var is_title = _db.MenuRoles.AsNoTracking().Where(m => m.MenuDesCode==model.MenuDesCode&&m.UserId==model.UserId&&m.ParentId==model.ParentId);
                if (is_title.Any() == true)
                {
                    st.code = 500;
                    st.status = "warning";
                    st.title = "Find Menu Role.";
                    st.message = "The menu is already in the list. Please check again before adding or updating new.";
                    return st;
                }
                if (model.Code != null && model.Code != "")
                {
                    var get = await _db.MenuRoles.AsNoTracking().SingleOrDefaultAsync(m => m.Code == model.Code);
                    if (get != null)
                    {
                        get.MenuDesCode = model.MenuDesCode;
                        get.ParentId=model.ParentId==null?"Nan":model.ParentId;
                        get.Display = "Nan";
                        get.ParentId = "Nan";
                        get.UpdateAt=DateTime.UtcNow;
                        get.UpdateBy = model.userupsert;
                        get.IsCreate=model.IsCreate;
                        get.IsView = model.IsView;
                        get.IsDeleted=model.IsDeleted;
                        get.IsEdit=model.IsEdit;
                        get.Status = true;
                        get.ActiveStatus = 2;
                        get.TitleActive = "Edit success";

                        _db.MenuRoles.Update(get);
                        await _db.SaveChangesAsync();
                        st.code = 200;
                        st.status = "success";
                        st.title = "Update Menu Role.";
                        st.message = "Update menu success";

                    }
                    else
                    {
                        st.code = 500;
                        st.status = "warning";
                        st.title = "Update Menu Role.";
                        st.message = "Not found menu. Reload page or check menu.";
                    }
                }
                else
                {
                    var m = new MenuRole();
                    m.Code = ConfigGeneral.CodeData("MRMO");
                    m.MenuCode = model.MenuCode ?? "Nan";
                    m.MenuDesCode = model.MenuDesCode ?? "Nan";
                    m.ParentId = model.ParentId == null ? "Nan" : model.ParentId;
                    m.Other = model.Other??"Nan";
                    m.Display = model.Display??"Nan";
                    m.IsCreate= model.IsCreate;
                    m.IsView = model.IsView;
                    m.IsDeleted= model.IsDeleted;
                    m.IsEdit= model.IsEdit;
                    m.CreateAt= DateTime.UtcNow;
                    m.CreateBy = model.userupsert;

                    _db.MenuRoles.Add(m);
                    _db.SaveChanges();

                    st.code = 200;
                    st.status = "success";
                    st.title = "Create Menu Role.";
                    st.message = "Create menu success";
                }
                return st;
            }
            catch
            {
                return st;
            }
        }
        public async Task<List<MenuViewModels>> GetMenuCookie(string user_id)
        {
            var list=new List<MenuViewModels>();
            try
            {
                var get = await (from mr in _db.MenuRoles.AsNoTracking()
                                 join m in _db.MenuDes.AsNoTracking() on mr.MenuDesCode equals m.Code
                                 where mr.UserId == user_id && m.Code == mr.MenuDesCode && mr.ParentId == "Nan"
                                 select new MenuViewModels
                                 {
                                     title = m.Title,
                                     url = m.Url,
                                     slug = m.Slug,
                                     value_type = m.ValueField,
                                     child = (from mr1 in _db.MenuRoles.AsNoTracking().Where(ms => ms.ParentId == mr.MenuDesCode)
                                              join m1 in _db.MenuDes.AsNoTracking() on mr1.MenuDesCode equals m1.Code
                                              where mr1.ParentId == mr.MenuDesCode
                                              select new MenuViewModels
                                              {
                                                  title = m1.Title,
                                                  url = m.Url + "/" + m1.Url,
                                                  slug = m1.Slug,
                                                  value_type = m1.ValueField,

                                              }).ToHashSet(),
                                 }).ToListAsync();
                if(get.Count() > 0)
                {
                    list = get.ToList();
                }
                return list;

            }
            catch
            {
                return list;
            }
        }
    }
}
