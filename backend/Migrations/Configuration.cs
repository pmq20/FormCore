namespace FormCoreCSharp.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<FormCoreCSharp.Context>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }
    }
}
