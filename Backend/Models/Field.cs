using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormCore
{
  [Table("FormCoreFields")]
  public class Field
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
    public string Column { get; set; }
    public string Label { get; set; }
    public FieldType Type { get; set; }
    public double Position { get; set; }
    public string DefaultValue { get; set; }
    public string PlaceHolder { get; set; }
    public string Help { get; set; }
    public string Formatter { get; set; }
    public string Mode { get; set; }
    public string TokenSeparators { get; set; }
    public string PayloadJson { get; set; }

    public virtual Form Form { get; set; }
    public virtual Section Section { get; set; }
    public virtual ICollection<Validation> Validations { get; set; }
  }
}