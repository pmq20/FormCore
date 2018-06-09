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
    public static int Create(Context db, FForm input, Action before = null, Action<Form> after = null)
    {
      before?.Invoke();
      var form = Form.Create(db, input.Title, input.ParentId);
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
  }
}
