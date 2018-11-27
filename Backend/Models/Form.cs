using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using FormCore.Exceptions;

namespace FormCore {
  [Table("FormCoreForms")]
  public class Form : Base {
    private List<Field> _allFields;
    private List<Section> _allSections;

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

    public List<Section> AllSections(Context db,out Dictionary<int, int> sectionMapping) {
      sectionMapping = new Dictionary<int, int>();
      if (null != _allSections) return _allSections;
      List<Section> ret;
      if (!Parents.Any()) {
        ret = Sections?.ToList() ?? new List<Section>();
      } else {
        ret = new List<Section>();
        foreach (var parent in Parents)
        foreach (var item in parent.AllSections(db,out sectionMapping)) {

          var ids = ret.Where(x => x.ParentId == item.ParentId).Select(x => x.Id).ToList();
          ids.Add(item.Id);
          foreach (var id in ids) {
            if (sectionMapping.ContainsKey(id)) {
              sectionMapping[id] = item.Id;
            } else {
              sectionMapping.Add(id, item.Id);
            }
          }
          ret.RemoveAll(x => x.Id == item.Id);
          ret.RemoveAll(x => x.Id == item.ParentId);
          ret.RemoveAll(x => x.ParentId == item.ParentId);
          ret.Add(item);
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

    public List<Field> AllFields(Context db,Dictionary<int, int> sectionMapping =null) {
      if (null != _allFields) return _allFields;
      List<Field> ret;
      if (!Parents.Any()) {
        ret = Fields?.ToList() ?? new List<Field>();
      } else {
        ret = new List<Field>();
        foreach (var parent in Parents)
        foreach (var item in parent.AllFields(db, sectionMapping)) {
          ret.RemoveAll(x => x.Id == item.Id);
          //Because different user modify the same fields in form, only the last user'change is displayed
          ret.RemoveAll(x => x.ParentId == item.ParentId && x.ParentId != 0);
          if (sectionMapping != null && sectionMapping.ContainsKey(item.SectionId)) {
            item.SectionId = sectionMapping[item.SectionId];
          }

          ret.Add(item);
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

    private void ClearCache() {
      _allFields = null;
      _allSections = null;
    }
  }
}