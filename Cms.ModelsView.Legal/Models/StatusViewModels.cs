using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.ModelsView.Legal.Models
{
    public class StatusViewModels
    {
        public int code { get; set; }
        public string status { get; set; }  
        public string message { get; set; }
        public string title { get; set; }
        public object data { get; set; }
    }
    public class StatusViewModels<T>where T:class,new()
    {
        public int code { get; set; }
        public string status { get; set; }
        public string message { get; set; }
        public string title { get; set; }
        public T data { get; set; }=new T();
    }

    public class StatusListViewModels<T> where T : class, new()
    {
        public int code { get; set; }
        public string status { get; set; }
        public string message { get; set; }
        public string title { get; set; }
        public List<T> data { get; set; } = new List<T>();
    }
}
