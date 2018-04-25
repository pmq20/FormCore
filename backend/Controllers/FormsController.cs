using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace FormCoreCSharp
{
  public class FormsController : ApiController
  {
    public Context DbContext { get; set; }

    [HttpGet]
    [Route("forms")]
    public OTotalCount<OForm> Index() {
      return new OTotalCount<OForm>(DbContext.Forms.Select(x => new OForm {
        Name = x.Name,
      }));
    }
  }
}