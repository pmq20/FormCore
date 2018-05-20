using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FormCore
{
  [Table("FormCoreDrafts")]
  public class Draft
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public string DataJson { get; set; }

    [NotMapped]
    public dynamic Data => string.IsNullOrEmpty(DataJson) ? null : JsonConvert.DeserializeObject<dynamic>(DataJson);
  }
}
