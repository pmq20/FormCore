using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;

namespace FormCore
{
  [Table("FormCoreForms")]
  public class Form
  {
    public int Id { get; set; }
    public string Title { get; set; }

    public virtual ICollection<Section> Sections { get; set; }
    public virtual ICollection<Field> Fields { get; set; }
    public virtual ICollection<Validation> Validations { get; set; }

    public static Form Load(Context db, int id)
    {
      return db.FormCoreForms.Include("Sections").Include("Sections.Fields").Include("Sections.Fields.Validations")
        .First(x => x.Id == id);
    }

    public static Form Create(Context db, Form form)
    {
      var ret = new Form
      {
        Title = form.Title,
      };
      db.FormCoreForms.Add(ret);
      db.SaveChanges();
      foreach (var section in form.Sections)
      {
        ret.CreateSection(db, section);
      }
      return ret;
    }
    
    private Section CreateSection(Context db, Section section)
    {
      var ret = new Section
      {
        FormId = Id,
        Title = section.Title,
        Position = section.Position,
      };
      db.FormCoreSections.Add(ret);
      db.SaveChanges();
      foreach (var field in section.Fields)
      {
        ret.CreateField(db, field);
      }
      return ret;
    }

    public Draft CreateDraft(Context db, dynamic data)
    {
      var draft = new Draft
      {
        FormId = this.Id,
        DataJson = JsonConvert.SerializeObject(data),
      };
      db.FormCoreDrafts.Add(draft);
      db.SaveChanges();
      return draft;
    }
  }
}