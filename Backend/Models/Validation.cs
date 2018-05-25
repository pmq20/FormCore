using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore {
  [Table("FormCoreValidations")]
  public class Validation {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int FieldId { get; set; }
    public ValidationType Type { get; set; }
    public ValidationLevel Level { get; set; }
    public string Expectation { get; set; }
    public string Message { get; set; }

    public bool IsNotValid(Draft draft, Context db) {
      var field = db.FormCoreFields.Find(FieldId);
      if (Type == ValidationType.Presence) {
        var val = draft.Data[field.Column];
        if (val == null) {
          return true;
        } else if (val.Value is string) {
          return string.IsNullOrEmpty(val.Value);
        } else {
          return false;
        }
      }

      return true;
    }
  }
}
