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
    public List<Field> Index(int formId) {
      var form = DbContext.FormCoreForms.Find(formId);
      return form.Fields.OrderBy(x => new { x.SectionID, x.Position }).ToList();
    }

    [HttpPost]
    [Route("{formId:int}/fields")]
    public int Create(int formId, [FromBody] Field input)
    {
      var form = DbContext.FormCoreForms.Find(formId);
      var field = new Field
      {
        FormID = form.ID,
        SectionID = input.SectionID,
        Name = input.Name,
        Type = input.Type,
        Label = input.Label,
        Hint = input.Hint,
        Position = input.Position,
      };
      DbContext.FormCoreFields.Add(field);
      DbContext.SaveChanges();
      return field.ID;
    }
  }
}