namespace FormCoreCSharp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateForms : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Forms",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Forms");
        }
    }
}
