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
    public class LayoutQuery
    {
        private readonly LegalDbContext _db;
        public LayoutQuery(LegalDbContext db)
        {
            _db = db;
        }
        public async Task<List<AreaViewModels>>ListLocal(string type,long data)
        {
            var list= new List<AreaViewModels>();
            try
            {
                if (!string.IsNullOrEmpty(type) && type == "regions")
                {
                    var get = await (from d in _db.Regions
                                     select new AreaViewModels
                                     {
                                         id = d.Id,
                                         name = d.Name,
                                         type = ""
                                     }).ToDynamicListAsync();
                    if (get.Count > 0)
                    {
                        foreach (var item in get)
                        {
                            list.Add(item);
                        }
                        return list;
                    }
                }
                if (!string.IsNullOrEmpty(type)&&type=="country")
                {
                    var get = await (from d in _db.Countries
                                  where d.RegionId == data
                                  select new AreaViewModels
                                  {
                                      id = d.Id,
                                      name = d.Name,
                                      ios2 = d.Iso2,
                                      type = "state"
                                  }).ToDynamicListAsync();
                    if (get.Count > 0)
                    {
                        foreach(var item in get)
                        {
                            list.Add(item);
                        }
                        return list;
                    }
                }
                if (!string.IsNullOrEmpty(type) && type == "state")
                {
                    var get = await (from d in _db.States
                                     where d.CountryId == data
                                     select new AreaViewModels
                                     {
                                         id = d.Id,
                                         name = d.Name,
                                         ios2 = d.Iso2,
                                         type = "city"
                                     }).ToDynamicListAsync();
                    if (get.Count > 0)
                    {
                        foreach (var item in get)
                        {
                            list.Add(item);
                        }
                        return list;
                    }
                }
                if (!string.IsNullOrEmpty(type) && type == "city")
                {
                    var get = await (from d in _db.Cities
                                     where d.StateId == data
                                     select new AreaViewModels
                                     {
                                         id = d.Id,
                                         name = d.Name,
                                         ios2 = "",
                                         type = ""
                                     }).ToDynamicListAsync();
                    if (get.Count > 0)
                    {
                        foreach (var item in get)
                        {
                            list.Add(item);
                        }
                        return list;
                    }
                }
                return list;
            }
            catch
            {
                return list;
            }
        }
        public async Task<List<Category>>ListCategoryLaw(string id = "")
        {
            var list=new List<Category>();
            try
            {
                    var get =await _db.Categories.AsNoTracking().Where(m => m.TypeView == "law"&&m.ParentId==id).ToDynamicListAsync();
                    foreach(var item in get)
                    {
                        list.Add(item);
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
