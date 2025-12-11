using Cms.DataNpg.Legal.EF;
using Cms.Legal.Areas.SystemAreas;
using Cms.ModelsView.Legal.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.DynamicLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.QueryData
{
    public class ChatAIQuery
    {
        private readonly LegalDbContext _db;
        public ChatAIQuery(LegalDbContext db)
        {
            _db=db;
        }

        public async Task<StatusViewModels>UpsertChatAI(Chatai model)
        {
            var st=new StatusViewModels();
            try
            {
                var is_ip=_db.Chatais.AsNoTracking().Where(m=>m.IpUser==model.IpUser).Any();
                if (is_ip == false)
                {

                    var m = new Chatai();
                    m.Code = ConfigGeneral.CodeData("CMOA");
                    m.RoleUser = model.RoleUser;
                    m.NickName = model.NickName;
                    m.IpUser = model.IpUser;
                    m.DeviceUser = model.DeviceUser;
                    m.AppName = model.AppName;
                    m.UserId = model.UserId;
                    m.Token = model.Token;
                    m.StartAt = DateTime.UtcNow;
                    m.Status = true;
                    m.CreateAt = DateTime.UtcNow;

                    _db.Chatais.Add(m);
                    await _db.SaveChangesAsync();
                    st.code = 200;
                    st.status = "success";
                    st.title = "Chat AI.";
                    st.data = m;
                    st.message = "AI ready to talk with you.";
                }
                else
                {
                    var get=await _db.Chatais.AsNoTracking().SingleOrDefaultAsync(m=>m.IpUser == model.IpUser);
                    if (get != null)
                    {
                        st.data= get;
                    }
                    st.code = 501;
                    st.status = "info";
                    st.title = "Chat AI.";
                    st.message = "You ready chat AI.";
                }
                    return st;
            }
            catch
            {
                st.code = 404;
                st.status = "error";
                st.title = "Chat AI.";
                st.data = null;
                st.message = "AI is currently updating. Thank you for your understanding. We will be back in 10 minutes.";
                return st;
            }
        }
        public async Task<StatusViewModels>UpsertLogChat(Logchatai model)
        {
            var st = new StatusViewModels();
            try
            {
                if (model.Code != "" && model.Code != null)
                {
                    var get=await _db.Logchatais.AsNoTracking().SingleOrDefaultAsync(m=>m.Code==model.Code);
                    if(get!= null)
                    {
                        get.Block = model.Block;
                        get.UpdateAt=DateTime.UtcNow;
                        get.IsStorage=model.IsStorage;
                        get.Title = model.Title;
                        _db.Logchatais.Update(get);
                       await _db.SaveChangesAsync();

                        st.code = 200;
                        st.status = "success";
                        st.title = "Log Chat.";
                        st.data = get;
                        st.message = "Update success full.";
                        return st;
                    }
                    else
                    {
                        st.code = 500;
                        st.status = "warning";
                        st.title = "Log Chat.";
                        st.message = "Reload the page to update your conversation.";
                        return st;
                    }
                }
                else
                {
                    var m=new Logchatai();
                    m.Code = ConfigGeneral.CodeData("LCMO");
                    m.Title =ConfigGeneral.TextDefault( model.Title);
                    m.IsStorage = false;
                    m.Block = false;
                    m.CreateAt=DateTime.UtcNow;
                    m.ChataiCode=model.ChataiCode;

                    _db.Logchatais.Add(m);
                    await _db.SaveChangesAsync();

                    st.code = 200;
                    st.status = "success";
                    st.title = "Log Chat.";
                    st.data = m;
                    st.message = "Update success full.";
                    return st;
                }
            }
            catch
            {
                st.code = 404;
                st.status = "error";
                st.title = "Log Chat.";
                st.message = "The system is overloaded. Please try again in 1 minute.";
                return st;
            }
        }

        public async Task<StatusViewModels> UpsertContentChat(Contentchatai model)
        {
            var st=new StatusViewModels();
            try
            {
                if (model.Code != null && model.Code != "")
                {
                    var get =await _db.Contentchatais.FirstOrDefaultAsync(m => m.Code == model.Code);
                    if (get != null)
                    {
                            get.ReceiveChat = model.ContentChat;
                            get.ReceiveAt = DateTime.UtcNow;
                            _db.SaveChanges();

                            st.code = 200;
                            st.title = "Content Chat.";
                            st.message = "Update success";
                            st.data = get;
                            st.status = "success";
                    }
                }
                else
                {
                    var m=new Contentchatai();
                    m.Code = ConfigGeneral.CodeData("CTMO");
                    m.LogchataiCode = model.LogchataiCode;
                    m.SendAt= DateTime.UtcNow;
                    m.ContentChat = model.ContentChat;
                    _db.Contentchatais.Add(m);
                    await _db.SaveChangesAsync();

                    st.code = 200;
                    st.title = "Content Chat.";
                    st.message = "success";
                    st.data = m;
                    st.status = "success";

                    return st;
                }
                return st;
            }
            catch
            {
                st.code = 404;
                st.status = "error";
                st.title = "Content Chat.";
                st.data = null;
                st.message = "The system is currently busy processing and cannot complete your request. Please try again later!";
                return st;
            }
        }
        public async Task<List<Contentchatai>>ListAllContentChat(string id = "")
        {
            var list=new List<Contentchatai>();
            try
            {
                var get=await (from c in _db.Contentchatais.AsNoTracking()
                               where c.LogchataiCode== id
                               select c).ToDynamicListAsync();

                if (get.Count > 0)
                {
                    foreach(var item in get)
                    {
                        list .Add(item);
                    }
                }
                return list;
            }
            catch
            {
                return list;
            }
        }
        public async Task<List<Logchatai>>ListAllChat(string id = "")
        {
            var list = new List<Logchatai>();
            try
            {
                var get = await (from c in _db.Logchatais.AsNoTracking()
                                 where c.ChataiCode == id
                                 select c).ToDynamicListAsync();

                if (get.Count > 0)
                {
                    foreach (var item in get)
                    {
                        list.Add(item);
                    }
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
