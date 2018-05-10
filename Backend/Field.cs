using System.ComponentModel.DataAnnotations.Schema;

namespace FormCore
{
  [Table("FormCoreFields")]
  public class Field
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
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