using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormCore
{
  public class OForm
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public IEnumerable<OSection> Sections { get; set; }
    public IEnumerable<OField> Fields { get; set; }

    public OForm(Form form)
    {
      Id = form.Id;
      Title = form.Title;
      Sections = form.Sections.Select(x => new OSection(x));
      Fields = form.Fields.Select(x => new OField(x));
    }

    public static OForm Show(Context db, int id)
    {
      var form = db.FormCoreForms.Include("Sections").Include("Fields.Validations").Include("Fields.Section").First(x => x.Id == id);
      return new OForm(form);
    }
  }
}