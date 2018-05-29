using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

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
        var val = draft.Data[field.StoredColumn];
        if (val == null) {
          return true;
        } else if (val.Type == JTokenType.Array) {
          return val.Count <= 0;
        } else if (val.Type == JTokenType.String) {
          return string.IsNullOrEmpty(val.Value as string);
        } else {
          return false;
        }
      }

      return true;
    }

    public string ReadableMessage(Field field) {
      if (Type == ValidationType.Presence) {
        if (Message == null || string.Empty == Message) {
          return $"{field.Label} cannot be blank";
        }
      }

      return Message;
    }
  }
}
