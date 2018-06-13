using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;

namespace FormCore {
  public class Context : DbContext {
    protected Context() {
    }

    protected Context(DbCompiledModel model) : base(model) {
    }

    public Context(DbConnection existingConnection, bool contextOwnsConnection) : base(existingConnection,
      contextOwnsConnection) {
    }

    public Context(DbConnection existingConnection, DbCompiledModel model, bool contextOwnsConnection) : base(
      existingConnection, model, contextOwnsConnection) {
    }

    public Context(ObjectContext objectContext, bool dbContextOwnsObjectContext) : base(objectContext,
      dbContextOwnsObjectContext) {
    }

    public Context(string nameOrConnectionString) : base(nameOrConnectionString) {
    }

    public Context(string nameOrConnectionString, DbCompiledModel model) : base(nameOrConnectionString, model) {
    }

    public virtual DbSet<Form> FormCoreForms { get; set; }
    public virtual DbSet<Section> FormCoreSections { get; set; }
    public virtual DbSet<Field> FormCoreFields { get; set; }
    public virtual DbSet<Validation> FormCoreValidations { get; set; }
    public virtual DbSet<Draft> FormCoreDrafts { get; set; }
  }
}