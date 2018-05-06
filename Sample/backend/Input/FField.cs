using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FormCore;

namespace FormCoreSample {
  public class FField {
    public int SectionID { get; set; }
    public string Name { get; set; }
    public FieldType Type { get; set; }
    public string Label { get; set; }
    public string Hint { get; set; }
    public int Position { get; set; }
  }
}