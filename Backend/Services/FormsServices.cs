using System;
using System.Collections.Generic;
using System.Linq;
using FormCore.Exceptions;

namespace FormCore {
  public class FormsServices<T, TO>
    where T : Form
    where TO : OForm {
    public static int Create(Context db, FForm input, Action before = null, Func<T, bool> permitting = null,
      Action<Form> after = null) {
      before?.Invoke();
      Form form;
      if (input.ParentId > 0) {
        var parentForm = Form.Load(db, input.ParentId) as T;
        if (null != permitting && !permitting.Invoke(parentForm)) throw new AccessDenied();
        form = new Form {
          ParentId = parentForm.Id,
          Title = string.IsNullOrEmpty(input.Title) ? parentForm.Title : input.Title
        };
      } else {
        form = new Form {
          Title = input.Title
        };
      }
      db.FormCoreForms.Add(form);
      db.SaveChanges();
      if (typeof(T) != typeof(Form)) {
        var sql = $"UPDATE TOP(1) dbo.FormCoreForms SET Discriminator='{typeof(T).Name}' where Id={form.Id}";
        db.Database.ExecuteSqlCommand(sql);
      }
      after?.Invoke(form);
      return form.Id;
    }

    public static List<TO> Index(Context db, Func<List<T>> query, Func<T, TO> returning = null) {
      return query.Invoke().ToList().Select(form => {
        if (null == returning) return (TO) new OForm(db, form);
        return returning.Invoke(form);
      }).ToList();
    }

    public static TO Show(Context db, int id, Func<T, bool> permitting = null, Func<T, TO> returning = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      if (null == returning) return (TO) new OForm(db, form);
      return returning.Invoke(form);
    }

    public static void Update(Context db, int id, FForm input, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      if (input.ParentId > 0) {
        var parentForm = Form.Load(db, input.ParentId) as T;
        if (null != permitting && !permitting.Invoke(parentForm)) throw new AccessDenied();
        form.ParentId = parentForm.Id;
      }
      if (!string.IsNullOrEmpty(input.Title)) form.Title = input.Title;
      db.SaveChanges();
    }

    public static void Delete(Context db, int id, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      form.Delete(db);
      db.SaveChanges();
    }
  }
}