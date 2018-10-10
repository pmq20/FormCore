using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormCore.Exceptions;
using Newtonsoft.Json;

namespace FormCore {
  public class DraftsServices<TDraft, TODraft>
    where TDraft : Draft
    where TODraft : ODraft {
    public static int Create(Context db, FDraft input, Func<bool> before = null, Action<Draft> after = null) {
      if (null != before && !before.Invoke()) throw new AccessDenied();
      var draft = new Draft {
        FormId = input.FormId,
        DataJson = JsonConvert.SerializeObject(input.Data),
      };
      db.FormCoreDrafts.Add(draft);
      db.SaveChanges();
      if (typeof(TDraft) != typeof(Draft)) {
        var sql = $"UPDATE TOP(1) dbo.FormCoreDrafts SET Discriminator='{typeof(TDraft).Name}' where Id={draft.Id}";
        db.Database.ExecuteSqlCommand(sql);
      }
      after?.Invoke(draft);
      return draft.Id;
    }

    public static List<TODraft> Index(Context db, Func<List<TDraft>> query, Func<TDraft, TODraft> returning = null) {
      return query.Invoke().ToList().Select(draft => {
        if (null == returning) return (TODraft)new ODraft(db, draft);
        return returning.Invoke(draft);
      }).ToList();
    }

    public static TODraft Show(Context db, int id, Func<TDraft, bool> permitting = null, Func<TDraft, TODraft> returning = null) {
      var draft = db.FormCoreDrafts.Where(x => x.Id == id).Include("Form").FirstOrDefault() as TDraft;
      if (null == draft) throw new NotFound();
        if (null != permitting && !permitting.Invoke(draft)) throw new AccessDenied();
      if (null == returning) return (TODraft)new ODraft(db, draft);
      return returning.Invoke(draft);
    }

    public static void Update(Context db, int id, FDraft input, Func<TDraft, bool> permitting = null, Action<TDraft> after = null) {
      var draft = db.FormCoreDrafts.Where(x => x.Id == id).Include("Form").FirstOrDefault() as TDraft;
      if (null == draft) throw new NotFound();
      if (null != permitting && !permitting.Invoke(draft)) throw new AccessDenied();
      draft.DataJson = JsonConvert.SerializeObject(input.Data);
      db.SaveChanges();
      after?.Invoke(draft);
    }

    public static void Delete(Context db, int id, Func<TDraft, bool> permitting = null, Action<TDraft> after = null) {
      var draft = db.FormCoreDrafts.Where(x => x.Id == id).Include("Form").FirstOrDefault() as TDraft;
      if (null != permitting && !permitting.Invoke(draft)) throw new AccessDenied();
      draft.Delete(db);
      after?.Invoke(draft);
      db.SaveChanges();
    }
  }
}
