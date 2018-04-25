using System.ComponentModel.DataAnnotations.Schema;

namespace FormCore
{
  [Table("FormCoreFields")]
  public class Field : Base
  {
    public int FormID { get; set; }
    public int SectionID { get; set; }
    public string Name { get; set; }
    public FieldType Type { get; set; }
    public string Label { get; set; }
    public string Hint { get; set; }
    public int Position { get; set; }

    public virtual Form Form { get; set; }
    public virtual Section Section { get; set; }
  }
}