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
    public class AddressQuery
    {
        private readonly LegalDbContext _db;

        public AddressQuery(LegalDbContext db)
        {
            _db = db;
        }

        public async Task<StatusViewModels> UpsertAddress(AddressUser address)
        {
            var st = new StatusViewModels();
            try
            {

                if (address.Code != "" && address.Code != null)
                {
                    var get_add=await _db.AddressUsers.AsNoTracking().SingleOrDefaultAsync(m=>m.Code == address.Code);
                    if (get_add != null)
                    {
                        get_add.UpdateAt = DateTime.UtcNow;
                        get_add.TitleAddress = address.TitleAddress;
                        get_add.FullAddress= address.FullAddress;
                        get_add.CityId = address.CityId;
                        get_add.StateId= address.StateId;
                        get_add.CountryId= address.CountryId;
                        get_add.RegionsId= address.RegionsId;
                        _db.AddressUsers.Update(get_add);
                        await _db.SaveChangesAsync();


                        st.title = "Update Address";
                        st.message = "Successfull.";
                        st.status = "success";
                        st.code = 200;
                        st.data = get_add;
                        return st;
                    }
                    else
                    {
                        st.title = "Update Address";
                        st.message = "Check information before updating information..";
                        st.status = "warning";
                        st.code = 500;
                        st.data = get_add;
                        return st;
                    }
                }
                else
                {
                    var Is_user =  _db.AddressUsers.AsNoTracking().Where(m => m.UserId == address.UserId);
                    var a = new AddressUser();
                    a.Code = ConfigGeneral.CodeData("ASRS");
                    a.CreateAt = DateTime.UtcNow;
                    a.IsBlock = false;
                    a.UserId = address.UserId;
                    a.IsSetDefault=Is_user.Any()==true?false:true;
                    a.FullAddress = address.FullAddress;
                    a.RegionsId= address.RegionsId;
                    a.CountryId= address.CountryId;
                    a.StateId= address.StateId;
                    a.CityId= address.CityId;
                    a.TitleAddress= address.TitleAddress;


                    _db.AddressUsers.Add(a);
                    await _db.SaveChangesAsync();


                    st.title = "Add Address User";
                    st.message = "Successfull.";
                    st.status = "success";
                    st.code = 200;
                    st.data = a;
                    return st;
                }
            }
            catch
            {
                st.title = "System LegalAI";
                st.message = "The system is currently busy. Please wait a moment while we process your information.";
                st.status = "error";
                st.code = 404;
                st.data = null;
                return st;
            }
        }
        public async Task<StatusViewModels>Deleted(string[] id)
        {
            var st=new StatusViewModels();
            try
            {
                if (id.Length > 0)
                {
                    foreach(var item in id)
                    {
                        var get =await _db.AddressUsers.SingleOrDefaultAsync(m => m.Code == item);
                        if (get != null)
                        {
                            _db.AddressUsers.Remove(get);
                        }
                    }

                    _db.SaveChanges();
                    st.code = 200;
                    st.title = "Remove Address.";
                    st.message = "Successfull.";
                    st.status = "success";
                    return st;
                }
                else
                {
                    st.code = 500;
                    st.title = "Remove Address.";
                    st.message = "Check the list again or reload the page to avoid saving old data.";
                    st.status = "warning";
                    return st;
                }
            }
            catch
            {
                st.code = 400;
                st.title = "Legal AI.";
                st.message = "The system is currently busy. Please wait a moment while we process your information.";
                st.status="error";
                return st;
            }
        }
    }
}
