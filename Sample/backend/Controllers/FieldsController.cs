using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using FormCore;

namespace FormCoreSample
{
  public class FieldsController : ApiController
  {
    public Context DbContext { get; set; }

    [HttpGet]
    [Route("{formId:int}/fields")]
    public IEnumerable<OField> Index(int formId) {
      var form = DbContext.FormCoreForms.Find(formId);
      return form.Fields.OrderBy(x => x.SectionID).ThenBy(x => x.Position).Select(x => new OField() {
        SectionID = x.SectionID,
        SectionTitle = x.Section.Title,
        Name = x.Name,
        ID = x.ID,
        Position = x.Position,
        Type = x.Type,
        Label = x.Label,
        Help = x.Help,
        Required = x.Required,
        RequiredMessage = x.RequiredMessage,
        PlaceHolder = x.PlaceHolder,
        Rows = x.Rows,
      });
    }

    [HttpPost]
    [Route("{formId:int}/fields")]
    public int Create(int formId, [FromBody] FField input)
    {
      var form = DbContext.FormCoreForms.Find(formId);
      var field = new Field
      {
        FormID = form.ID,
        SectionID = input.SectionID,
        Name = input.Name,
        Type = input.Type,
        Label = input.Label,
        Help = input.Help,
        Position = input.Position,
        Required = input.Required,
        RequiredMessage = input.RequiredMessage,
        PlaceHolder = input.PlaceHolder,
        Rows = input.Rows,
      };
      DbContext.FormCoreFields.Add(field);
      DbContext.SaveChanges();
      return field.ID;
    }
  }
}