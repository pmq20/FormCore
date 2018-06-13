using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore {
  public class SectionsServices<T>
    where T : Form
  {
    public static OSection Show(Context db, int id, int sectionId, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) {
        throw new Exceptions.AccessDenied();
      }
      var section = form.Sections.FirstOrDefault(x => sectionId == x.Id);
      if (null == section) {
        throw new Exceptions.NotFound();
      }
      return new OSection(section);
    }

    public static int Create(Context db, int id, FSection input, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) {
        throw new Exceptions.AccessDenied();
      }
      var section = new Section {
        FormId = form.Id,
        Title = input.Title,
        Position = input.Position,
      };
      db.FormCoreSections.Add(section);
      db.SaveChanges();
      return section.Id;
    }

    public static void Update(Context db, int id, int sectionId, FSection input, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) {
        throw new Exceptions.AccessDenied();
      }
      var section = form.Sections.FirstOrDefault(x => sectionId == x.Id);
      if (null == section) {
        throw new Exceptions.NotFound();
      }
      section.Title = input.Title;
      section.Position = input.Position;
      db.SaveChanges();
    }

    public static void Delete(Context db, int id, int sectionId, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) {
        throw new Exceptions.AccessDenied();
      }
      var section = form.Sections.FirstOrDefault(x => sectionId == x.Id);
      if (null == section) {
        throw new Exceptions.NotFound();
      }
      section.Delete(db);
      db.SaveChanges();
    }
  }
}
