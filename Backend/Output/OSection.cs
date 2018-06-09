using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormCore {
  public class OSection {
    public int Id { get; set; }
    public bool Inherited { get; set; }
    public double Position { get; set; }
    public string Title { get; set; }

    public OSection(Form form, Section instance) {
      Id = instance.Id;
      Inherited = instance.FormId != form.Id;
      Position = instance.Position;
      Title = instance.Title;
    }
  }
}