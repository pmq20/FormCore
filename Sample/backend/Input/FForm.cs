using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FormCoreSample {
  public class FForm
  {
    [Required]
    public string Title { get; set; }
  }
}