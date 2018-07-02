using FormCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCoreTest.Fixtures {
  class TestBase {
    /// <summary>
    /// calc virtual attributes manually
    /// </summary>
    internal static void CalcVirtualAttributes(Context db) {
      // forms
      foreach (var form in db.FormCoreForms) {
        form.Validations = db.FormCoreValidations
            .Where(v => v.FormId == form.Id).ToList();
        form.Fields = db.FormCoreFields
            .Where(f => f.FormId == form.Id).ToList();
        form.Sections = db.FormCoreSections
            .Where(f => f.FormId == form.Id).ToList();

        form.Drafts = db.FormCoreDrafts
            .Where(f => f.FormId == form.Id).ToList();
      }

      // sections
      foreach (var section in db.FormCoreSections) {
        section.Fields = db.FormCoreFields
            .Where(f => f.SectionId == section.Id).ToList();
      }

      // fields
      foreach (var field in db.FormCoreFields) {
        field.Validations = db.FormCoreValidations
            .Where(v => v.FieldId == field.Id).ToList();
      }
    }
  }
}
