using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormCore
{
  [Table("FormCoreSections")]
  public class Section : Base
  {
    public int FormID { get; set; }
    public string Title { get; set; }
    public int Position { get; set; }

    public virtual Form Form { get; set; }
    public virtual ICollection<Field> Fields { get; set; }
  }
}