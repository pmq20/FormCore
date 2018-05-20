using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore
{
  public class ODraft
  {
    public int Id { get; set; }
    public int FormId { get; set; }
    public dynamic Data { get; set; }

    public ODraft(Draft instance)
    {
      Id = instance.Id;
      FormId = instance.Id;
      Data = instance.Data;
    }
  }
}
