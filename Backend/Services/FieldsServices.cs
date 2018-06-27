using System;
using System.Data.Entity;
using System.Linq;
using FormCore.Exceptions;
using Newtonsoft.Json;

namespace FormCore {
  public class FieldsServices<TForm, TField>
    where TForm : Form
    where TField : Field {
    public static int Create(Context db, int id, FField input, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var section = form.Sections.FirstOrDefault(x => input.SectionId.Value == x.Id);
      if (null == section) throw new NotFound();
      var field = new Field {
        FormId = form.Id,
        SectionId = section.Id,
        Label = input.Label,
        FieldType = input.FieldType.Value,
        InputStyle = input.InputStyle.Value,
        Position = input.Position ?? 0,
        Help = input.Help,
        ColumnJson = null == input.Column ? null : JsonConvert.SerializeObject(input.Column),
        DefaultValueJson = null == input.DefaultValue ? null : JsonConvert.SerializeObject(input.DefaultValue),
        PlaceHolderJson = null == input.PlaceHolder ? null : JsonConvert.SerializeObject(input.PlaceHolder),
        PayloadJson = null == input.Payload ? null : JsonConvert.SerializeObject(input.Payload),
      };
      if (null != input.ParentId && input.ParentId.Value > 0) {
        var parentField = db.FormCoreFields.Where(x => x.Id == input.ParentId).Include("Form").FirstOrDefault();
        if (null == parentField) throw new NotFound();
        if (null != permitting && !permitting.Invoke(parentField.Form as TForm)) throw new AccessDenied();
        field.ParentId = parentField.Id;
        if (string.IsNullOrEmpty(field.Label)) field.Label = parentField.Label;
        if (string.IsNullOrEmpty(field.ColumnJson)) field.ColumnJson = parentField.ColumnJson;
      }
      db.FormCoreFields.Add(field);
      db.SaveChanges();
      if (typeof(TField) != typeof(Field)) {
        var sql = $"UPDATE TOP(1) dbo.FormCoreFields SET Discriminator='{typeof(TField).Name}' where Id={field.Id}";
        db.Database.ExecuteSqlCommand(sql);
      }
      return field.Id;
    }

    public static void Update(Context db, int id, int fieldId, FField input, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var field = form.Fields.FirstOrDefault(x => fieldId == x.Id);
      if (null == field) throw new NotFound();
      if (null != input.FieldType) {
        field.FieldType = input.FieldType.Value;
      }
      if (FieldType.BuiltIn == field.FieldType && null != input.Column) {
        field.ColumnJson = JsonConvert.SerializeObject(input.Column);
      }
      if (!string.IsNullOrEmpty(input.Label)) {
        field.Label = input.Label;
      }
      if (null != input.Position) {
        field.Position = input.Position.Value;
      }
      if (null != input.InputStyle) {
        field.InputStyle = input.InputStyle.Value;
      }
      if (null != input.DefaultValue) {
        field.DefaultValueJson = JsonConvert.SerializeObject(input.DefaultValue);
      }
      if (null != input.PlaceHolder) {
        field.PlaceHolderJson = JsonConvert.SerializeObject(input.PlaceHolder);
      }
      if (null != input.Payload) {
        field.PayloadJson = JsonConvert.SerializeObject(input.Payload);
      }
      if (null != input.ParentId && input.ParentId.Value > 0) {
        var parentField = db.FormCoreFields.Where(x => x.Id == input.ParentId.Value).Include("Form").FirstOrDefault();
        if (null == parentField) throw new NotFound();
        if (null != permitting && !permitting.Invoke(parentField.Form as TForm)) throw new AccessDenied();
        field.ParentId = parentField.Id;
        if (string.IsNullOrEmpty(field.Label)) field.Label = parentField.Label;
        if (string.IsNullOrEmpty(field.ColumnJson)) field.ColumnJson = parentField.ColumnJson;
      }
      db.SaveChanges();
    }

    public static void Delete(Context db, int id, int fieldId, Func<TForm, bool> permitting = null) {
      var form = Form.Load(db, id) as TForm;
      if (null != permitting && !permitting.Invoke(form)) throw new AccessDenied();
      var field = form.Fields.FirstOrDefault(x => fieldId == x.Id);
      if (null == field) throw new NotFound();
      field.Delete(db);
      db.SaveChanges();
    }
  }
}
