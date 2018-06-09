using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormCore {
  public class OForm {
    public int Id { get; set; }
    public int ParentId { get; set; }
    public string ParentTitle { get; set; }
    public string Title { get; set; }
    public List<OSection> Sections { get; set; }
    public List<OField> Fields { get; set; }

    public OForm() { }
    public OForm(Context db, Form form) {
      Id = form.Id;
      Title = form.Title;
      Sections = form.AllSections(db).Select(x => new OSection(form, x)).ToList();
      Fields = form.AllFields(db).Select(x => new OField(form, x)).ToList();
      if (null != form.Parent) {
        ParentId = form.Parent.Id;
        ParentTitle = form.Parent.Title;
      }
    }
  }
}