using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormCore {
  [Table("FormCoreParentings")]
  public class Parenting : Base {
    [Key]
    [Column(Order = 0)]
    public int ParentId { get; set; }

    [Key]
    [Column(Order = 1)]
    public int ChildId { get; set; }

    public int Priority { get; set; }
  }
}