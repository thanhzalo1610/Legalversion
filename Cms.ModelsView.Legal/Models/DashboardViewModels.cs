using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.ModelsView.Legal.Models
{
    public class DashboardViewModels
    {
        public string name { get; set; } = string.Empty;
        public string type { get; set; }=string.Empty;
        public object data { get; set; } = null;
    }

    public class DashboardViewModels<T> where T:class,new()
    {
        public string name { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
        public List<T> data { get; set; } = new List<T>();
    }
}
