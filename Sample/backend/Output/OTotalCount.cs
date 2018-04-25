using System.Collections.Generic;
using System.Linq;

namespace FormCoreSample {
  public class OTotalCount<T> {
    public OTotalCount(IEnumerable<T> results) {
      TotalCount = results.Count();
      Results = results;
    }

    public int TotalCount { get; set; }
    public IEnumerable<T> Results { get; set; }
  }
}