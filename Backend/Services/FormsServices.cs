﻿using System;
using System.Collections.Generic;
using System.Linq;
using FormCore.Exceptions;

namespace FormCore {
  public class FormsServices<TForm, TOForm>
    where TForm : Form
    where TOForm : OForm {
    public static int Create(Context db, FForm input, Action before = null, Func<TForm, bool> viewPermitting = null, 
      Action<Form> after = null) {
      before?.Invoke();
      Form form;
      foreach (var parentId in input.ParentIds) {
        var parentForm = Form.Load(db, parentId) as TForm;
        if (null != viewPermitting && !viewPermitting.Invoke(parentForm)) throw new AccessDenied();
      }
      form = new Form {
        Title = input.Title
      };
      db.FormCoreForms.Add(form);
      db.SaveChanges();
      if (typeof(TForm) != typeof(Form)) {
        var sql = $"UPDATE TOP(1) dbo.FormCoreForms SET Discriminator='{typeof(TForm).Name}' where Id={form.Id}";
        db.Database.ExecuteSqlCommand(sql);
      }
      foreach (var parentId in input.ParentIds) {
        var parenting = new Parenting {
          ParentId = parentId,
          ChildId = form.Id,
        };
        db.FormCoreParentings.Add(parenting);
        db.SaveChanges();
      }
      after?.Invoke(form);
      return form.Id;
    }

    public static List<TOForm> Index(Context db, Func<List<TForm>> query, Func<TForm, TOForm> returning = null) {
      return query.Invoke().ToList().Select(form => {
        if (null == returning) return (TOForm) new OForm(db, form);
        return returning.Invoke(form);
      }).ToList();
    }

    public static TOForm Show(Context db, int id, Func<TForm, bool> permitting = null, Func<TForm, TOForm> returning = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      if (null == returning) return (TOForm) new OForm(db, form);
      return returning.Invoke(form);
    }

    public static void Update(Context db, int id, FForm input, Func<TForm, bool> viewPermitting = null, Func<TForm, bool> editPermitting = null, Action<TForm> after = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != editPermitting && !editPermitting.Invoke(form)) throw new AccessDenied();
      if (null != input.ParentIds && input.ParentIds.Any()) {
        foreach (var inputParentId in input.ParentIds) {
          if (inputParentId == form.Id) throw new AccessDenied("ParentID is not valid");
          var parentForm = Form.Load(db, inputParentId) as TForm;
          if (null != viewPermitting && !viewPermitting.Invoke(parentForm)) throw new AccessDenied();
        }

        // Update parentids, use input.ParentIds to override currentParentIds
        var currentParentIds = form.Parents.Select(p => p.Id).ToList();
        foreach (var inputParentId in input.ParentIds) {
          if (!currentParentIds.Contains(inputParentId)) {
            var parenting = new Parenting {ParentId = inputParentId, ChildId = form.Id };
            db.FormCoreParentings.Add(parenting);
            db.SaveChanges();
          }
        }
        foreach (var currentParentId in currentParentIds) {
          if (!input.ParentIds.Contains(currentParentId)) {
            var parenting = db.FormCoreParentings.Where(p => p.ParentId == currentParentId && p.ChildId == form.Id).FirstOrDefault();
            db.FormCoreParentings.Remove(parenting);
            db.SaveChanges();
          }
        }
        // End of update parentIds
      }
          if (!string.IsNullOrEmpty(input.Title)) form.Title = input.Title;
      db.SaveChanges();
      after?.Invoke(form);
    }

    public static void Delete(Context db, int id, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      form.Delete(db);
      db.SaveChanges();
    }
  }
}