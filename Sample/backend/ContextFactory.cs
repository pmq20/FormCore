using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace FormCoreSample
{
  public class ContextFactory : IDbContextFactory<Context>
  {
    public Context Create()
    {
      return new Context();
    }
  }

}