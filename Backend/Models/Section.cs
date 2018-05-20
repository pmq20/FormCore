using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormCore
{
  [Table("FormCoreSections")]
  public class Section
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public string Title { get; set; }
    public double Position { get; set; }

    public virtual Form Form { get; set; }
    public virtual ICollection<Field> Fields { get; set; }

    public object CreateField(Context db, Field field)
    {
      var ret = new Field
      {
        FormId = FormId,
        SectionId = Id,
        ColumnJson = field.ColumnJson,
        Label = field.Label,
        Type = field.Type,
        Position = field.Position,
        DefaultValueJson = field.DefaultValueJson,
        PlaceHolderJson = field.PlaceHolderJson,
        Help = field.Help,
        Formatter = field.Formatter,
        PayloadJson = field.PayloadJson,
      };
      db.FormCoreFields.Add(ret);
      db.SaveChanges();
      foreach (var validation in field.Validations)
      {
        ret.CreateValidation(db, validation);
      }
      return ret;
    }
  }
}