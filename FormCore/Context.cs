using System.Data.Entity;

namespace FormCore
{
  public class Context : DbContext
  {
    public Context() { }
    public Context(string x) : base(x) { }
    public virtual DbSet<Form> FormCoreForms { get; set; }
    public virtual DbSet<Section> FormCoreSections { get; set; }
    public virtual DbSet<Field> FormCoreFields { get; set; }
  }
}