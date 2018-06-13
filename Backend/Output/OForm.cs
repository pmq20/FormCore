using System.Collections.Generic;
using System.Linq;

namespace FormCore {
  public class OForm {
    public OForm() {
    }

    public OForm(Context db, Form form) {
      Id = form.Id;
      Title = form.Title;
      Sections = form.AllSections(db).Select(x => new OSection(x)).ToList();
      Fields = form.AllFields(db).Select(x => new OField(x)).ToList();
      if (null != form.Parent) {
        ParentId = form.Parent.Id;
        ParentTitle = form.Parent.Title;
      }
    }

    public int Id { get; set; }
    public int ParentId { get; set; }
    public string ParentTitle { get; set; }
    public string Title { get; set; }
    public List<OSection> Sections { get; set; }
    public List<OField> Fields { get; set; }
  }
}