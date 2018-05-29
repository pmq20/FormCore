using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore {
  public class OValidation {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int FieldId { get; set; }
    public ValidationType Type { get; set; }
    public ValidationLevel Level { get; set; }
    public string Expectation { get; set; }
    public string Message { get; set; }

    public OValidation(Validation instance) {
      Id = instance.Id;
      FormId = instance.FormId;
      FieldId = instance.FieldId;
      Type = instance.Type;
      Level = instance.Level;
      Expectation = instance.Expectation;
      Message = instance.Message;
    }
  }
}
