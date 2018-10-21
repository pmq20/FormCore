using System.Linq;
using FormCore;

namespace FormCoreTest.Fixtures {
  internal class TestBase {
    /// <summary>
    ///   calc virtual attributes manually
    /// </summary>
    internal static void CalcVirtualAttributes(Context db) {
      // forms
      foreach (var form in db.FormCoreForms) {
        form.Fields = db.FormCoreFields
          .Where(f => f.FormId == form.Id).ToList();
        form.Sections = db.FormCoreSections
          .Where(f => f.FormId == form.Id).ToList();
      }

      // sections
      foreach (var section in db.FormCoreSections)
        section.Fields = db.FormCoreFields
          .Where(f => f.SectionId == section.Id).ToList();
    }
  }
}