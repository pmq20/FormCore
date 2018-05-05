using System.Data.Entity.Migrations;

namespace FormCoreSample.Migrations {
  internal sealed class Configuration : DbMigrationsConfiguration<Context> {
    public Configuration() {
      AutomaticMigrationsEnabled = false;
    }
  }
}