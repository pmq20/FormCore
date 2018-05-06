using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using FormCore;

namespace FormCoreSample
{
  public class SectionsController : ApiController
  {
    public Context DbContext { get; set; }

    [HttpGet]
    [Route("{formId:int}/sections")]
    public IEnumerable<OSection> Index(int formId)
    {
      var form = DbContext.FormCoreForms.Find(formId);
      return form.Sections.OrderBy(x => x.Position).Select(x => new OSection() {
        ID = x.ID,
        Title = x.Title,
      });
    }

    [HttpPost]
    [Route("{formId:int}/sections")]
    public int Create(int formId, [FromBody] FSection input)
    {
      var form = DbContext.FormCoreForms.Find(formId);
      var section = new Section {
        FormID = form.ID,
        Title = input.Title,
        Position = input.Position,
      };
      DbContext.FormCoreSections.Add(section);
      DbContext.SaveChanges();
      return section.ID;
    }
  }
}