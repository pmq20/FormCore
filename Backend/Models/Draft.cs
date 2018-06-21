using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using Newtonsoft.Json;

namespace FormCore {
  [Table("FormCoreDrafts")]
  public class Draft {
    public int Id { get; set; }
    public int FormId { get; set; }
    public string DataJson { get; set; }
    
    public virtual Form Form { get; set; }

    [NotMapped]
    public dynamic Data => string.IsNullOrEmpty(DataJson) ? null : JsonConvert.DeserializeObject<dynamic>(DataJson);
    
    public void Delete(Context db) {
      db.Entry(this).State = EntityState.Deleted;
    }
  }
}