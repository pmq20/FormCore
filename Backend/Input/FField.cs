using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FField {
    [Required] public int? SectionId { get; set; }
    [Required] public string Label { get; set; }
    [Required] public dynamic Column { get; set; }
    [Required] public double? Position { get; set; }
    [Required] public FieldType? Type { get; set; }

    public int? ParentId { get; set; }
    public string Help { get; set; }
    public string Formatter { get; set; }
    public dynamic PlaceHolder { get; set; }
    public dynamic DefaultValue { get; set; }
    public dynamic Payload { get; set; }
  }
}