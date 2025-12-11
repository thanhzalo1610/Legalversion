using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cms.Legal.Areas.SystemAreas
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class RequireClientInfoAttribute : TypeFilterAttribute
    {
        public RequireClientInfoAttribute() : base(typeof(ClientInfoFilter)) { }
    }
}
