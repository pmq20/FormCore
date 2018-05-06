using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using FormCore;

namespace FormCoreSample {
  public class FormsController : ApiController {
    public Context DbContext { get; set; }

    [HttpPost]
    [Route("~/")]
    public int Create([FromBody] FForm input) {
      var form = new Form {
        Title = input.Title
      };
      DbContext.FormCoreForms.Add(form);
      DbContext.SaveChanges();
      return form.ID;
    }

    [HttpGet]
    [Route("~/")]
    public IEnumerable<OForm> Index() {
      return DbContext.FormCoreForms.Select(x => new OForm() {
        ID = x.ID,
        Title = x.Title,
      });
    }
  }
}