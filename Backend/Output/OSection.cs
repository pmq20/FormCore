using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormCore {
  public class OSection {
    public int Id { get; set; }
    public int ParentId { get; set; }
    public double Position { get; set; }
    public string Title { get; set; }

    public OSection(Section instance) {
      Id = instance.Id;
      ParentId = instance.ParentId;
      Position = instance.Position;
      Title = instance.Title;
    }
  }
}