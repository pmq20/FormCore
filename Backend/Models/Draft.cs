using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using Newtonsoft.Json;

namespace FormCore {
  [Table("FormCoreDrafts")]
  public class Draft {
    public int Id { get; set; }
    public int FormId { get; set; }
    public string DataJson { get; set; }

    [NotMapped]
    public dynamic Data => string.IsNullOrEmpty(DataJson) ? null : JsonConvert.DeserializeObject<dynamic>(DataJson);

    public virtual void Delete(Context db) {
      db.Entry(this).State = EntityState.Deleted;
    }
  }
}