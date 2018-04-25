using System;
using System.Data.Entity;

namespace FormCoreCSharp
{
  public class Context : DbContext {
    public Context() : base("server=(local);Trusted_Connection=true;Integrated Security=SSPI;Connection Timeout=120;database=form_core_csharp") { }
    public virtual DbSet<Form> Forms { get; set; }
  }
}