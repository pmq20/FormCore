using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormCoreCSharp
{
  public class OTotalCount<T>
  {
    public OTotalCount(IEnumerable<T> results)
    {
      TotalCount = results.Count();
      Results = results;
    }

    public int TotalCount { get; set; }
    public IEnumerable<T> Results { get; set; }
  }
}