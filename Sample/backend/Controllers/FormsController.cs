using System.Linq;
using System.Web.Http;

namespace FormCoreSample {
  public class FormsController : ApiController {
    public Context DbContext { get; set; }

    [HttpPost]
    [Route("forms")]
    public int Create([FromBody] FForm input) {
      var form = new FormCore.Form {
        Title = input.Title
      };
      DbContext.FormCoreForms.Add(form);
      DbContext.SaveChanges();
      return form.ID;
    }
  }
}