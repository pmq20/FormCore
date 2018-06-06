using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;

namespace FormCore {
  [Table("FormCoreForms")]
  public class Form {
    private List<Section> _allSections;
    private List<Field> _allFields;

    public int Id { get; set; }
    public int ParentId { get; set; }
    public string Title { get; set; }

    public virtual ICollection<Section> Sections { get; set; }
    public virtual ICollection<Field> Fields { get; set; }
    public virtual ICollection<Validation> Validations { get; set; }

    [NotMapped]
    public Form Parent { get; private set; }

    public static Form Load(Context db, int id) {
      var ret = db.FormCoreForms.Include("Sections.Fields.Validations")
        .First(x => x.Id == id);
      if (ret.ParentId > 0) {
        ret.Parent = Load(db, ret.ParentId);
      } else {
        ret.Parent = null;
      }
      return ret;
    }
    
    public Draft CreateDraft(Context db, dynamic data) {
      var draft = new Draft {
        FormId = this.Id,
        DataJson = JsonConvert.SerializeObject(data),
      };
      db.FormCoreDrafts.Add(draft);
      db.SaveChanges();
      return draft;
    }

    public List<Section> AllSections(Context db) {
      if (null != _allSections) {
        return _allSections;
      }
      List<Section> ret;
      if (null == Parent) {
        ret = Sections?.ToList() ?? new List<Section>();
      } else {
        ret = Parent.AllSections(db);
        if (null != Sections) {
          foreach (var item in Sections) {
            ret.RemoveAll(x => x.Id == item.Id);
            ret.Add(item);
          }
        }
      }
      ret.Sort();
      _allSections = ret;
      return ret;
    }

    public List<Field> AllFields(Context db) {
      if (null != _allFields) {
        return _allFields;
      }
      List<Field> ret;
      if (null == Parent) {
        ret = Fields?.ToList() ?? new List<Field>();
      } else {
        ret = Parent.AllFields(db);
        if (null != Fields) {
          foreach (var item in Fields) {
            ret.RemoveAll(x => x.ColumnJson == item.ColumnJson);
            ret.Add(item);
          }
        }
      }
      ret.Sort();
      _allFields = ret;
      return ret;
    }


    public Dictionary<string, string[]> Validate(Context db, Draft draft, ValidationLevel level = ValidationLevel.Warning) {
      ValidationLevel[] levels;
      switch (level) {
        case ValidationLevel.Error:
          levels = new ValidationLevel[] { ValidationLevel.Error };
          break;
        case ValidationLevel.Warning:
        default:
          levels = new ValidationLevel[] { ValidationLevel.Warning, ValidationLevel.Error };
          break;
      }

      var ValidationErrors = new Dictionary<string, string[]>();
      foreach (var validation in this.Validations) {
        if (!levels.Contains(validation.Level)) continue;

        var field = db.FormCoreFields.Find(validation.FieldId);
        var key = field.StoredColumn;

        var errors = new List<string>();
        if (validation.IsNotValid(draft, db)) errors.Add(validation.ReadableMessage(field));
        if (errors.Count > 0) ValidationErrors.Add(key, errors.ToArray());
      }
      return ValidationErrors;
    }

    public static Form Create(Context db, Form parentForm) {
      var ret = new Form {
        ParentId = parentForm.Id,
        Title = parentForm.Title,
      };
      db.FormCoreForms.Add(ret);
      db.SaveChanges();
      return ret;
    }
  }
}
