using System.Collections.Generic;
using System.Linq;

namespace FormCore {
  public class OField {
    public OField(Field instance) {
      Id = instance.Id;
      ParentId = instance.ParentId;
      FormId = instance.FormId;
      SectionId = instance.SectionId;
      Label = instance.Label;
      FieldType = instance.FieldType;
      InputStyle = instance.InputStyle;
      Position = instance.Position;
      DefaultValue = instance.DefaultValue;
      PlaceHolder = instance.PlaceHolder;
      Help = instance.Help;
      Payload = instance.Payload;
      Validations = instance.Validations.Select(x => new OValidation(x));
      Column = instance.StoredColumn;
    }

    public int Id { get; set; }
    public int ParentId { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
    public FieldType FieldType { get; set; }
    public InputStyle InputStyle { get; set; }
    public string Column { get; set; }
    public string Label { get; set; }
    public double Position { get; set; }
    public dynamic DefaultValue { get; set; }
    public dynamic PlaceHolder { get; set; }
    public string Help { get; set; }
    public dynamic Payload { get; set; }
    public IEnumerable<OValidation> Validations { get; set; }
  }
}