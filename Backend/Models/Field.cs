using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FormCore {
  [Table("FormCoreFields")]
  public class Field : Base, IComparable<Field> {
    public int Id { get; set; }
    public int FormId { get; set; }
    public int SectionId { get; set; }
    public int ParentId { get; set; }
    public FieldType FieldType { get; set; }
    public InputStyle InputStyle { get; set; }
    public string ColumnJson { get; set; }
    public string Label { get; set; }
    public double Position { get; set; }
    public string DefaultValueJson { get; set; }
    public string PlaceHolderJson { get; set; }
    public string Help { get; set; }
    public string PayloadJson { get; set; }

    public virtual Form Form { get; set; }
    public virtual Section Section { get; set; }

    [NotMapped]
    public dynamic Column =>
      string.IsNullOrEmpty(ColumnJson) ? null : JsonConvert.DeserializeObject<dynamic>(ColumnJson);

    [NotMapped]
    public string[] Columns {
      get {
        var column = Column;
        if (column == null) return new string[] { };
        if (column is string) column = new string[] {column};
        if (column is JArray) column = (column as JArray).Select(c => c as dynamic).Select(c => c as string).ToArray();
        return column;
      }
    }

    [NotMapped]
    public dynamic DefaultValue => string.IsNullOrEmpty(DefaultValueJson)
      ? null
      : JsonConvert.DeserializeObject<dynamic>(DefaultValueJson);

    [NotMapped]
    public dynamic PlaceHolder => string.IsNullOrEmpty(PlaceHolderJson)
      ? null
      : JsonConvert.DeserializeObject<dynamic>(PlaceHolderJson);

    [NotMapped]
    public dynamic Payload =>
      string.IsNullOrEmpty(PayloadJson) ? null : JsonConvert.DeserializeObject<dynamic>(PayloadJson);

    /// <summary>
    ///   Column name stored in database
    /// </summary>
    [NotMapped]
    public string StoredColumn {
      get {
        var c = Column;
        if (c is JArray) {
          var list = (c as JArray).Select(x => (string) x).ToList();
          return string.Join("__FORMCORE__", list);
        }
        return c;
      }
    }

    public int CompareTo(Field other) {
      return Position.CompareTo(other.Position);
    }
  }
}