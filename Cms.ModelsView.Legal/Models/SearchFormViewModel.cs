using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.ModelsView.Legal.Models
{
    public class SearchFormViewModel
    {
        public string area{ get; set; } = "";
        public string country { get; set; } = "";
        public string city { get; set; } = "";
        public string state { get; set; } = "";
        public string category_law { get; set; } = "";
        public string type_law { get; set; } = "";
    }
    public class AreaViewModels
    {
        public long id { get; set; }
        public string name { get; set; }
        public string ios2 { get; set; }
        public string type { get; set; }
    }
    public class ListSearchViewModels
    {
        public List<ResultLawyerSearch> result { get; set; }= new List<ResultLawyerSearch>();
    }
    public class ResultLawyerSearch
    {
        public string image { get; set; }
        public string name { get; set; }

        public int ratting { get; set; }
        public int numberrating { get;set; }
        public List<string> category_law { get; set; } = new List<string>();
        public string description { get; set; }
        public string url { get; set; }
    }
}
