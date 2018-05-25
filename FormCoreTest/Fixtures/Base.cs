using FormCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCoreTest.Fixtures {
  class Base {
    /// <summary>
    /// calc virtual attributes manually
    /// </summary>
    internal static void CalcVirtualAttributes(Context db) {
      foreach (var form in db.FormCoreForms) {
        form.Validations = db.FormCoreValidations
            .Where(v => v.FormId == form.Id).ToList();
        form.Fields = db.FormCoreFields
            .Where(f => f.FormId == form.Id).ToList();
      }
    }
  }
}
