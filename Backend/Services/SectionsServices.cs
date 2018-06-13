using System;
using System.Linq;
using FormCore.Exceptions;

namespace FormCore {
  public class SectionsServices<TForm, TSection>
    where TForm : Form
    where TSection: Section {
    public static int Create(Context db, int id, FSection input, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var section = new Section {
        FormId = form.Id,
        Title = input.Title,
        Position = input.Position
      };
      db.FormCoreSections.Add(section);
      db.SaveChanges();
      if (typeof(TSection) != typeof(Section)) {
        var sql = $"UPDATE TOP(1) dbo.FormCoreSections SET Discriminator='{typeof(TSection).Name}' where Id={form.Id}";
        db.Database.ExecuteSqlCommand(sql);
      }
      return section.Id;
    }

    public static OSection Show(Context db, int id, int sectionId, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var section = form.Sections.FirstOrDefault(x => sectionId == x.Id);
      if (null == section) throw new NotFound();
      return new OSection(section);
    }

    public static void Update(Context db, int id, int sectionId, FSection input, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var section = form.Sections.FirstOrDefault(x => sectionId == x.Id);
      if (null == section) throw new NotFound();
      section.Title = input.Title;
      section.Position = input.Position;
      db.SaveChanges();
    }

    public static void Delete(Context db, int id, int sectionId, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var section = form.Sections.FirstOrDefault(x => sectionId == x.Id);
      if (null == section) throw new NotFound();
      section.Delete(db);
      db.SaveChanges();
    }
  }
}