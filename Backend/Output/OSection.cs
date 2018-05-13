using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FormCore
{
  public class OSection
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public OSection(Section x)
    {
      Id = x.Id;
      Title = x.Title;
    }
  }
}