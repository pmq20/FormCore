using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore {
  public class FSection {
    [Required]
    public string Title { get; set; }
    [Required]
    public int Position { get; set; }
  }
}
