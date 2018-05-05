using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using FormCore;

namespace FormCoreSample {
  public class FormsController : ApiController {
    public Context DbContext { get; set; }

    [HttpPost]
    [Route("forms")]
    public int Create([FromBody] Form input) {
      var form = new Form {
        Title = input.Title
      };
      DbContext.FormCoreForms.Add(form);
      DbContext.SaveChanges();
      return form.ID;
    }

    [HttpGet]
    [Route("forms")]
    public List<Form> Index() {
      return DbContext.FormCoreForms.ToList();
    }
  }
}