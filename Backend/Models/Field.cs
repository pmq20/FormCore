using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace FormCore
{
  [Table("FormCoreFields")]
  public class Field
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
    public string ColumnJson { get; set; }
    public string Label { get; set; }
    public FieldType Type { get; set; }
    public double Position { get; set; }
    public string DefaultValueJson { get; set; }
    public string PlaceHolderJson { get; set; }
    public string Help { get; set; }
    public string Formatter { get; set; }
    public string PayloadJson { get; set; }

    public virtual Form Form { get; set; }
    public virtual Section Section { get; set; }
    public virtual ICollection<Validation> Validations { get; set; }

    [NotMapped]
    public dynamic Column => string.IsNullOrEmpty(ColumnJson) ? null : JsonConvert.DeserializeObject<dynamic>(ColumnJson);
    [NotMapped]
    public dynamic DefaultValue => string.IsNullOrEmpty(DefaultValueJson) ? null : JsonConvert.DeserializeObject<dynamic>(DefaultValueJson);
    [NotMapped]
    public dynamic PlaceHolder => string.IsNullOrEmpty(PlaceHolderJson) ? null : JsonConvert.DeserializeObject<dynamic>(PlaceHolderJson);
    [NotMapped]
    public dynamic Payload => string.IsNullOrEmpty(PayloadJson) ? null : JsonConvert.DeserializeObject<dynamic>(PayloadJson);
  }
}