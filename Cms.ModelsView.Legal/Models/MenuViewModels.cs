using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.ModelsView.Legal.Models
{
    public class MenuViewModels
    {
        public string title { get; set; } = string.Empty;
        public string slug { get; set; } = string.Empty;
        public string url { get; set; } = string.Empty;
        public string type_data { get; set; } = string.Empty;
        public string value_type { get; set; } = string.Empty;
        public HashSet<MenuViewModels> child { get; set; } = new HashSet<MenuViewModels>();
    }
    public class TypeViewMenu
    {
        public List<TypeViewModels> types()
        {
            return new List<TypeViewModels>()
            {
                new TypeViewModels() { code = "layout", title = "Layout" },
                new TypeViewModels() { code = "admin", title = "Admin" },
            };

        }
    }
    public class TypeField
    {
        public List<TypeViewModels> types()
        {
            return new List<TypeViewModels>()
            {
                new TypeViewModels() { code = "icon", title = "Icon" },
                new TypeViewModels() { code = "image", title = "Image" },
            };

        }
    }
    public class TypeViewModels
    {
        public string code { get; set; }
        public string title { get; set; }
    }
    public class MenuRoleViewModels
    {
        public string Code { get; set; }

        public string MenuDesCode { get; set; }

        public string MenuCode { get; set; }

        public string ParentId { get; set; }

        public string Other { get; set; }

        public string Display { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsView { get; set; }

        public bool IsCreate { get; set; }

        public bool IsEdit { get; set; }

        public string UserId { get; set; }
        public string userupsert { get; set; }
    }
}
