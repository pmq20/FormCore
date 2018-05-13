using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormCore
{
  [Table("FormCoreForms")]
  public class Form
  {
    public int Id { get; set; }
    public string Table { get; set; }
    public string Title { get; set; }

    public virtual ICollection<Section> Sections { get; set; }
    public virtual ICollection<Field> Fields { get; set; }
    public virtual ICollection<Validation> Validations { get; set; }
  }
}