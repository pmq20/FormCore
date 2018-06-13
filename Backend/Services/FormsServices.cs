using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore {
  public class FormsServices<T, TO>
    where T : Form
    where TO : OForm
  {
    public static int Create(Context db, FForm input, Action before = null, Func<T, bool> permitting = null, Action<Form> after = null)
    {
      before?.Invoke();
      Form form;
      if (input.ParentId > 0) {
        var parentForm = Form.Load(db, input.ParentId) as T;
        if (null != permitting && !permitting.Invoke(parentForm)) {
          throw new Exceptions.AccessDenied();
        }
        form = new Form {
          ParentId = parentForm.Id,
          Title = String.IsNullOrEmpty(input.Title) ? parentForm.Title : input.Title,
        };
      } else {
        form = new Form {
          Title = input.Title,
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

    public static List<TO> Index(Context db, Func<List<T>> query, Func<T, TO> returning = null)
    {
      return query.Invoke().ToList().Select(form => {
        if (null == returning) {
          return (TO) new OForm(db, form);
        } else {
          return returning.Invoke(form);
        }
      }).ToList();
    }

    public static TO Show(Context db, int id, Func<T, bool> permitting = null, Func<T, TO> returning = null)
    {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) {
        throw new Exceptions.AccessDenied();
      }
      if (null == returning) {
        return (TO) new OForm(db, form);
      } else {
        return returning.Invoke(form);
      }
    }

    public static void Update(Context db, int id, FForm input, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) {
        throw new Exceptions.AccessDenied();
      }
      if (input.ParentId > 0) {
        var parentForm = Form.Load(db, input.ParentId) as T;
        if (null != permitting && !permitting.Invoke(parentForm)) {
          throw new Exceptions.AccessDenied();
        }
        form.ParentId = parentForm.Id;
      }
      if (!String.IsNullOrEmpty(input.Title)) {
        form.Title = input.Title;
      }
      db.SaveChanges();
    }

    public static void Delete(Context db, int id, Func<T, bool> permitting = null) {
      var form = Form.Load(db, id) as T;
      if (null != permitting && !permitting.Invoke(form)) {
        throw new Exceptions.AccessDenied();
      }
      form.Delete(db);
      db.SaveChanges();
    }
  }
}
