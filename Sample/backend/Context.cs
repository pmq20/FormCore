using System.Configuration;

namespace FormCoreSample {
  public class Context : FormCore.Context {
    public Context() : base(ConnectionString) { }

    public static string ConnectionString => ConfigurationManager.AppSettings[""] ??
                                             "server=(local);Trusted_Connection=true;Integrated Security=SSPI;Connection Timeout=120;database=form_core_csharp";
  }
}