using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using FormCore.Exceptions;
using FormCore.Models;

namespace FormCore {
  [Table("FormCoreForms")]
  public class Form : Base {
    private List<Field> _allFields;
    private List<Section> _allSections;
    private Dictionary<int, int> _sectionMapping;

    public int Id { get; set; }
    public string Title { get; set; }

    public virtual ICollection<Section> Sections { get; set; }
    public virtual ICollection<Field> Fields { get; set; }

    [NotMapped]
    public List<Form> Parents { get; private set; }

    public static Form Load(Context db, int id) {
      var ret = db.FormCoreForms.Include("Sections").Include("Fields").FirstOrDefault(x => x.Id == id);
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


    public List<Section> AllSections(Context db) {
      if (null != _allSections) {
        return _allSections;
      }
      List<Section> ret;
      if (!Parents.Any()) {
        ret = Sections?.ToList() ?? new List<Section>();
      } else {
        ret = new List<Section>();
        foreach (var parent in Parents)
        foreach (var item in parent.AllSections(db)) {
          ret.RemoveAll(x => x.Id == item.Id);
          ret.Add(item);
        }
        if (null != Sections)
          foreach (var item in Sections) {
            ret.RemoveAll(x => x.Id == item.ParentId);
            ret.Add(item);
          }
      }
      ret = ret.ToList();
      ret.Sort();
      _allSections = ret;
      return ret;
    }

    public List<Section> AllSections(Context db,out Dictionary<int,int> dic) {
      dic = new Dictionary<int, int>();
      if (null != _allSections) {
        dic = _sectionMapping;
        return _allSections;
      }
      List<Section> ret;
      if (!Parents.Any()) {
        ret = Sections?.ToList() ?? new List<Section>();
      } else {
        ret = new List<Section>();
        foreach (var parent in Parents) {
          var list = parent.AllSections(db, out dic);
          foreach (var item in list) {
            ret.RemoveAll(x => x.Id == item.Id);
            ret.Add(item);
          }
          if (null != Sections)
            foreach (var item in Sections) {
              ret.RemoveAll(x => x.Id == item.ParentId);
              ret.Add(item);
            }
        }
      }
      ret = ret.Distinct().ToList();
      ret.Sort();
      _allSections = ret;
      dic = _allSections.GetSectionMergeMappingDic();
      _sectionMapping = dic;
      return ret;
    }

    public List<Field> AllFields(Context db) {
      if (null != _allFields) return _allFields;
      List<Field> ret;
      if (!Parents.Any()) {
        ret = Fields?.ToList() ?? new List<Field>();
      } else {
        ret = new List<Field>();
        foreach (var parent in Parents)
        foreach (var item in parent.AllFields(db)) {
          ret.RemoveAll(x => x.Id == item.Id);
          ret.Add(item);
        }
        if (null != Fields)
          foreach (var item in Fields) {
            ret.RemoveAll(x => x.Id == item.ParentId);
            ret.Add(item);
          }
      }
      ret = ret.ToList();
      ret.Sort();
      _allFields = ret;
      return ret;
    }

    public List<Field> AllFields(Context db,Dictionary<int,int> sectionMergeMapping) {
      if (null != _allFields) return _allFields;
      List<Field> ret;
      if (!Parents.Any()) {
        ret = Fields?.ToList() ?? new List<Field>();
      } else {
        ret = new List<Field>();
        foreach (var parent in Parents)
          foreach (var item in parent.AllFields(db, sectionMergeMapping)) {
            ret.RemoveAll(x => x.Id == item.Id);
            ret.Add(item);
          }
        if (null != Fields)
          foreach (var item in Fields) {
            ret.RemoveAll(x => x.Id == item.ParentId);
            ret.Add(item);
          }
      }
      ret = ret.Distinct().ToList();
      if (sectionMergeMapping != null && sectionMergeMapping.Any()) {
        foreach (var field in ret) {
          if (sectionMergeMapping.TryGetValue(field.SectionId, out var sId)) {
            field.SectionId = sId;
          }
        }
      }
      ret.Sort();
      _allFields = ret;
      return ret;
    }

    private void ClearCache() {
      _allFields = null;
      _allSections = null;
    }

  }
}