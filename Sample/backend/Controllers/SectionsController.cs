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
    public List<Section> Index(int formId)
    {
      var form = DbContext.FormCoreForms.Find(formId);
      return form.Sections.OrderBy(x => x.Position).ToList();
    }

    [HttpPost]
    [Route("{formId:int}/sections")]
    public int Create(int formId, [FromBody] Section input)
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