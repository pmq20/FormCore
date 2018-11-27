using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using FormCore.Models;

namespace FormCore {
  [Table("FormCoreSections")]
  public class Section : Base, IComparable<Section> , IEquatable<Section> {
    public int Id { get; set; }
    public int FormId { get; set; } 
    public int ParentId { get; set; }
    public string Title { get; set; }
    public double Position { get; set; }
    public Dictionary<int,int> SectionMergeMapping { get; set; }

    public virtual Form Form { get; set; }
    public virtual ICollection<Field> Fields { get; set; }

    public int CompareTo(Section other) {
      return Position.CompareTo(other.Position);
    }


    public bool Equals(Section other) {
      if (ReferenceEquals(null, other)) return false;
      if (ReferenceEquals(this, other)) return true;
      var result = ParentId == other.ParentId && ParentId != 0;
      if (result && Id != other.Id) {
        if (SectionMergeMapping == null) {
          SectionMergeMapping = new Dictionary<int, int>(){{other.Id,Id}};
        } else {
          SectionMergeMapping.Set(other.Id, Id);
        }
      }
      return result;
    }

    public override bool Equals(object obj)
    {
      if (ReferenceEquals(null, obj)) return false;
      if (ReferenceEquals(this, obj)) return true;
      if (obj.GetType() != this.GetType()) return false;
      return Equals((Section) obj);
    }

    public override int GetHashCode()
    {
      unchecked
      {
        var hashCode = 13;
        hashCode = (hashCode * 397) ^ ParentId;
        if (ParentId == 0) {
          hashCode = (hashCode * 397) ^ Id; ;
        }
        return hashCode;
      }
    }

    public static bool operator ==(Section left, Section right)
    {
      return Equals(left, right);
    }

    public static bool operator !=(Section left, Section right)
    {
      return !Equals(left, right);
    }
  }
}