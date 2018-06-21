using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FField {
    public int? SectionId { get; set; }
    public string Label { get; set; }
    public dynamic Column { get; set; }
    public int? ParentId { get; set; }
    public FieldType? FieldType { get; set; }
    public InputStyle? InputStyle { get; set; }
    public double? Position { get; set; }
    public string Help { get; set; }
    public string Formatter { get; set; }
    public dynamic PlaceHolder { get; set; }
    public dynamic DefaultValue { get; set; }
    public dynamic Payload { get; set; }
  }
}