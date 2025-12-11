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
    public class MockTrialQuery
    {
        private readonly LegalDbContext _db;
        public MockTrialQuery(LegalDbContext db)
        {
            _db = db;
        }

        public async Task<StatusViewModels> UpsertMockTrialAsync(MockTrial model)
        {
            var st = new StatusViewModels();
            try
            {
                if (model.Code != null && model.Code != "")
                {
                    var checkData = await _db.MockTrials.Where(x => x.Code == model.Code).SingleOrDefaultAsync();
                    if (checkData != null)
                    {
                        checkData.Title = ConfigGeneral.TextDefault(model.Title);
                        checkData.Description = ConfigGeneral.TextDefault(model.Description);
                        checkData.UpdateAt = DateTime.Now;
                        _db.MockTrials.Update(checkData);
                        _db.SaveChanges();
                        st.title = "Update Mock Trial";
                        st.message = "Successfull.";
                        st.status = "success";
                        st.data = checkData;
                        st.code = 200;
                    }
                    else
                    {
                        st.title = "Update Mock Trial";
                        st.message = "Data not found.";
                        st.status = "error";
                        st.code = 404;
                        st.data = null;
                    }
                }
                else
                {

                    model.Code = ConfigGeneral.CodeData("METR");
                    model.Status = true;
                    model.Title = ConfigGeneral.TextDefault(model.Title);
                    model.Description = ConfigGeneral.TextDefault(model.Description);
                    model.ActiveStatus = 1;
                    model.StatusActive = "Active";
                    _db.MockTrials.Add(model);
                    _db.SaveChanges();
                    st.title = "Create Mock Trial";
                    st.message = "Successfull.";
                    st.status = "success";
                    st.data = model;
                    st.code = 200;
                }
                return st;
            }
            catch (Exception ex)
            {
                st.title = "System LegalAI";
                st.message = "The system is currently busy. Please wait a moment while we process your information.";
                st.status = "error";
                st.code = 404;
                st.data = null;
                return st;
            }
        }
        public async Task<List<MockTrialViewModels>> ListMockTrial(string code)
        {
            var data = new List<MockTrialViewModels>();
            try
            {
                var query = await (from mt in _db.MockTrials
                                   where mt.CreateBy == code
                                   select new MockTrialViewModels
                                   {
                                       code = mt.Code,
                                       title = mt.Title,
                                       description = mt.Description,
                                       categoryId = mt.CategoryId,
                                       categoryName = (from cl in _db.Categories
                                                       where cl.Code == mt.CategoryId
                                                       select cl.Title).FirstOrDefault() ?? ""
                                   }).ToDynamicListAsync();
                if (query.Count() > 0)
                {
                    foreach (var item in query)
                    {
                        data.Add(item);
                    }
                }
                return data;
            }
            catch
            {
                return data;
            }
        }
        public async Task<Practicipant> GetContentTrial(string code)
        {
            try
            {
                var query = await _db.Practicipants.AsNoTracking().Where(x => x.MockTrialId == code).FirstOrDefaultAsync();
                return query;
            }
            catch
            {
                return null;
            }
        }
    }
}
