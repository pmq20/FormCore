using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore
{
  public class Validation
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int FieldId { get; set; }
    public ValidationType Type { get; set; }
    public ValidationLevel Level { get; set; }
    public string Expectation { get; set; }
    public string Message { get; set; }
  }
}
