using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using FormCore;
using Newtonsoft.Json;

namespace FormCore
{
  public class OField : IComparable<OField>
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
    public string SectionTitle { get; set; }
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

    public OField(Field instance)
    {
      Id = instance.Id;
      FormId = instance.FormId;
      SectionId = instance.SectionId;
      SectionTitle = instance.Section.Title;
      Label = instance.Label;
      Type = instance.Type;
      Position = instance.Position;
      DefaultValue = instance.DefaultValue;
      PlaceHolder = instance.PlaceHolder;
      Help = instance.Help;
      Formatter = instance.Formatter;
      Payload = instance.Payload;
      Validations = instance.Validations.Select(x => new OValidation(x));

      AssignColumn(instance);
    }

    private void AssignColumn(Field instance)
    {
      var c = instance.Column;
      if (c is Newtonsoft.Json.Linq.JArray)
      {
        var list = (c as Newtonsoft.Json.Linq.JArray).Select(x => (string)x).ToList();
        Column = string.Join("__FORMCORE__", list);
      }
      else
      {
        Column = c;
      }
    }

    public int CompareTo(OField other)
    {
      return Position.CompareTo(other.Position);
    }
  }
}
