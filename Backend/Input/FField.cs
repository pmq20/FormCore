using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore {
  public class FField {
    [Required]
    public string Label { get; set; }
    [Required]
    public int Position { get; set; }
  }
}
