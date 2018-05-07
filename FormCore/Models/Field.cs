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
    public string Help { get; set; }
    public int Position { get; set; }
    public bool Required { get; set; }
    public string RequiredMessage { get; set; }
    public string PlaceHolder { get; set; }
    public int Rows { get; set; }

    public virtual Form Form { get; set; }
    public virtual Section Section { get; set; }
  }
}