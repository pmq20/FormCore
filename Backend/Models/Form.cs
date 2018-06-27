using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using FormCore.Exceptions;
using Newtonsoft.Json;

namespace FormCore {
  [Table("FormCoreForms")]
  public class Form {
    private List<Field> _allFields;
    private List<Section> _allSections;

    public int Id { get; set; }
    public int ParentId { get; set; }
    public string Title { get; set; }

    public virtual ICollection<Draft> Drafts { get; set; }
    public virtual ICollection<Section> Sections { get; set; }
    public virtual ICollection<Field> Fields { get; set; }
    public virtual ICollection<Validation> Validations { get; set; }

    [NotMapped]
    public Form Parent { get; private set; }

    public static Form Load(Context db, int id) {
      var ret = db.FormCoreForms.Include("Sections.Fields.Validations")
        .FirstOrDefault(x => x.Id == id);
      if (null == ret) throw new NotFound();
      ret.Parent = ret.ParentId > 0 ? Load(db, ret.ParentId) : null;
      return ret;
    }

    public Draft CreateDraft(Context db, dynamic data) {
      var draft = new Draft {
        FormId = Id,
        DataJson = JsonConvert.SerializeObject(data)
      };
      db.FormCoreDrafts.Add(draft);
      db.SaveChanges();
      return draft;
    }

    public List<Section> AllSections(Context db) {
      if (null != _allSections) return _allSections;
      List<Section> ret;
      if (null == Parent) {
        ret = Sections?.ToList() ?? new List<Section>();
      } else {
        ret = Parent.AllSections(db);
        if (null != Sections)
          foreach (var item in Sections) {
            ret.RemoveAll(x => x.Id == item.ParentId);
            ret.Add(item);
          }
      }
      ret.Sort();
      _allSections = ret;
      return ret;
    }

    public List<Field> AllFields(Context db) {
      if (null != _allFields) return _allFields;
      List<Field> ret;
      if (null == Parent) {
        ret = Fields?.ToList() ?? new List<Field>();
      } else {
        ret = Parent.AllFields(db);
        if (null != Fields)
          foreach (var item in Fields) {
            ret.RemoveAll(x => x.Id == item.ParentId);
            ret.Add(item);
          }
      }
      ret.Sort();
      _allFields = ret;
      return ret;
    }


    public Dictionary<string, string[]> Validate(Context db, Draft draft,
      ValidationLevel level = ValidationLevel.Warning) {
      ValidationLevel[] levels;
      switch (level) {
        case ValidationLevel.Error:
          levels = new[] {ValidationLevel.Error};
          break;
        case ValidationLevel.Warning:
        default:
          levels = new[] {ValidationLevel.Warning, ValidationLevel.Error};
          break;
      }

      var ValidationErrors = new Dictionary<string, string[]>();

      // append parentErrors
      if(null != Parent) {
        var parentErrors = Parent.Validate(db, draft);
        foreach(var key in parentErrors.Keys) {
          ValidationErrors.Add(key, parentErrors[key]);
        }
      }

      // append selfErrors
      foreach (var validation in Validations) {
        if (!levels.Contains(validation.Level)) continue;

        var field = db.FormCoreFields.Find(validation.FieldId);
        var key = field.StoredColumn;

        var errors = new List<string>();
        if (validation.IsNotValid(draft, db)) errors.Add(validation.ReadableMessage(field));
        if (errors.Count > 0) ValidationErrors.Add(key, errors.ToArray());
      }
      return ValidationErrors;
    }

    public void Delete(Context db) {
      // TODO Delete inherited forms
      foreach (var draft in Drafts.ToList()) {
        draft.Delete(db);
      }
      foreach (var section in Sections.ToList()) {
        section.Delete(db);
      }
      db.Entry(this).State = EntityState.Deleted;
    }

    private void ClearCache() {
      _allFields = null;
      _allSections = null;
    }
  }
}