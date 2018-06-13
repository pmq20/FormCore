using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace FormCore {
  [Table("FormCoreSections")]
  public class Section : IComparable<Section> {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int ParentId { get; set; }
    public string Title { get; set; }
    public double Position { get; set; }

    public virtual Form Form { get; set; }
    public virtual ICollection<Field> Fields { get; set; }

    public int CompareTo(Section other) {
      return Position.CompareTo(other.Position);
    }

    public void Delete(Context db) {
      foreach (var field in Fields.ToList()) {
        field.Delete(db);
      }
      db.Entry(this).State = EntityState.Deleted;
    }
  }
}