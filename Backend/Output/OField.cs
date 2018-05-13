using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FormCore;

namespace FormCore
{
  public class OField : IComparable<OField>
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
    public string SectionTitle { get; set; }
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
    public IEnumerable<OValidation> Validations { get; set; }

    public OField(Field instance)
    {
      Id = instance.Id;
      FormId = instance.FormId;
      SectionId = instance.SectionId;
      Label = instance.Label;
      Type = instance.Type;
      Position = instance.Position;
      DefaultValue = instance.DefaultValue;
      PlaceHolder = instance.PlaceHolder;
      Help = instance.Help;
      Formatter = instance.Formatter;
      Mode = instance.Mode;
      TokenSeparators = instance.TokenSeparators;
      PayloadJson = instance.PayloadJson;

      SectionTitle = instance.Section.Title;
      Validations = instance.Validations.Select(x => new OValidation(x));
    }

    public int CompareTo(OField other)
    {
      return (int)(other.Position - Position);
    }
  }
}