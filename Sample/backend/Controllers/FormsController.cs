using System.Linq;
using System.Web.Http;

namespace FormCoreSample {
  public class FormsController : ApiController {
    public Context DbContext { get; set; }

    [HttpGet]
    [Route("forms")]
    public OTotalCount<OForm> Index() {
      return new OTotalCount<OForm>(
        DbContext.FormCoreForms.Select(
          x => new OForm {
            Title = x.Title
          }
        )
      );
    }
  }
}