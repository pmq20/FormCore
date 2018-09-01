using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using FormCore.Exceptions;
using Newtonsoft.Json;

namespace FormCore {
  [Table("FormCoreForms")]
  public class Form : Base {
    private List<Field> _allFields;
    private List<Section> _allSections;

    public int Id { get; set; }
    public string Title { get; set; }

    public virtual ICollection<Draft> Drafts { get; set; }
    public virtual ICollection<Section> Sections { get; set; }
    public virtual ICollection<Field> Fields { get; set; }
    public virtual ICollection<Validation> Validations { get; set; }

    [NotMapped]
    public List<Form> Parents { get; private set; }

    public static Form Load(Context db, int id) {
      var ret = db.FormCoreForms.Include("Sections").Include("Fields").Include("Validations")
        .FirstOrDefault(x => x.Id == id);
      if (null == ret) throw new NotFound();
      ret.Parents = ret.ParentIds(db).ToList().Select(x => Load(db, x)).ToList();
      return ret;
    }

    private IQueryable<int> ParentIds(Context db) {
      return from parenting in db.FormCoreParentings
        where parenting.ChildId == Id
        orderby parenting.Priority descending 
        select parenting.ParentId;
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
      if (!Parents.Any()) {
        ret = Sections?.ToList() ?? new List<Section>();
      } else {
        ret = new List<Section>();
        foreach (var parent in Parents) {
          foreach (var item in parent.AllSections(db)) {
            ret.RemoveAll(x => x.Id == item.Id);
            ret.Add(item);
          }
        }
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
      if (!Parents.Any()) {
        ret = Fields?.ToList() ?? new List<Field>();
      } else {
        ret = new List<Field>();
        foreach (var parent in Parents) {
          foreach (var item in parent.AllFields(db)) {
            ret.RemoveAll(x => x.Id == item.Id);
            ret.Add(item);
          }
        }
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

      var fields = AllFields(db);
      foreach(var field in fields) {
        var validations = field.Validations;
        if(validations == null) validations = new List<Validation>() { };
        foreach( var validation in validations) {
          if (!levels.Contains(validation.Level)) continue;
          var key = field.StoredColumn;
          var errors = new List<string>();
          if (validation.IsNotValid(draft, db)) errors.Add(validation.ReadableMessage(field));
          if (errors.Count > 0) ValidationErrors.Add(key, errors.ToArray());
        }
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