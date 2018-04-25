namespace FormCoreSample.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

  internal sealed class Configuration : DbMigrationsConfiguration<FormCoreSample.Context> {
    public Configuration() {
      AutomaticMigrationsEnabled = false;
    }
  }
}
