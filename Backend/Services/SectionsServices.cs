using System;
using System.Data.Entity;
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
        Position = input.Position ?? 0
      };
      if (null != input.ParentId && input.ParentId.Value > 0) {
        var parentSection = db.FormCoreSections.Where(x => x.Id == input.ParentId).Include("Form").FirstOrDefault();
        if (null == parentSection) throw new NotFound();
        if (null != permitting && !permitting.Invoke(parentSection.Form as TForm)) throw new AccessDenied();
        section.ParentId = parentSection.Id;
        if (string.IsNullOrEmpty(section.Title)) section.Title = parentSection.Title;
      }
      db.FormCoreSections.Add(section);
      db.SaveChanges();
      if (typeof(TSection) != typeof(Section)) {
        var sql = $"UPDATE TOP(1) dbo.FormCoreSections SET Discriminator='{typeof(TSection).Name}' where Id={section.Id}";
        db.Database.ExecuteSqlCommand(sql);
      }
      return section.Id;
    }
    
    public static void Update(Context db, int id, int sectionId, FSection input, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var section = form.Sections.FirstOrDefault(x => sectionId == x.Id);
      if (null == section) throw new NotFound();
      if (!string.IsNullOrEmpty(input.Title)) {
        section.Title = input.Title;
      }
      if (null != input.Position) {
        section.Position = input.Position.Value;
      }
      if (null != input.ParentId && input.ParentId.Value > 0) {
        var parentSection = db.FormCoreSections.Where(x => x.Id == input.ParentId.Value).Include("Form").FirstOrDefault();
        if (null == parentSection) throw new NotFound();
        if (null != permitting && !permitting.Invoke(parentSection.Form as TForm)) throw new AccessDenied();
        section.ParentId = parentSection.Id;
        if (string.IsNullOrEmpty(section.Title)) section.Title = parentSection.Title;
      }
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