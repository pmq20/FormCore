using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FormCore;

namespace FormCoreSample {
  public class OField {
    public int SectionID { get; set; }
    public string SectionTitle { get; set; }
    public string Name { get; set; }
    public int ID { get; set; }
    public int Position { get; set; }
    public FieldType Type { get; set; }
  }
}