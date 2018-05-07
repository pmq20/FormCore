using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using FormCore;

namespace FormCoreSample {
  public class FField {
    [Required]
    public int SectionID { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public FieldType Type { get; set; }
    [Required]
    public string Label { get; set; }
    [Required]
    public int Position { get; set; }
    [Required]
    public bool Required { get; set; }

    public string Help { get; set; }
    public string RequiredMessage { get; set; }
    public string PlaceHolder { get; set; }
    public int Rows { get; set; }
  }
}