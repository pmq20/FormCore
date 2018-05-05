using System.Data.Entity.Infrastructure;

namespace FormCoreSample {
  public class ContextFactory : IDbContextFactory<Context> {
    public Context Create() {
      return new Context();
    }
  }
}