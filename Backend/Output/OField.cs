using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using FormCore;
using Newtonsoft.Json;

namespace FormCore {
  public class OField {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
    public bool Inherited { get; set; }
    public string Column { get; set; }
    public string Label { get; set; }
    public FieldType Type { get; set; }
    public double Position { get; set; }
    public dynamic DefaultValue { get; set; }
    public dynamic PlaceHolder { get; set; }
    public string Help { get; set; }
    public string Formatter { get; set; }
    public dynamic Payload { get; set; }
    public IEnumerable<OValidation> Validations { get; set; }

    public OField(Form form, Field instance) {
      Id = instance.Id;
      FormId = instance.FormId;
      SectionId = instance.SectionId;
      Inherited = (instance.FormId != form.Id);
      Label = instance.Label;
      Type = instance.Type;
      Position = instance.Position;
      DefaultValue = instance.DefaultValue;
      PlaceHolder = instance.PlaceHolder;
      Help = instance.Help;
      Formatter = instance.Formatter;
      Payload = instance.Payload;
      Validations = instance.Validations.Select(x => new OValidation(x));
      Column = instance.StoredColumn;
    }
    
  }
}
