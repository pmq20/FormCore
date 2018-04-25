namespace FormCoreSample.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateInitial3Tables : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FormCoreFields",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        FormID = c.Int(nullable: false),
                        SectionID = c.Int(nullable: false),
                        Name = c.String(),
                        Type = c.Int(nullable: false),
                        Label = c.String(),
                        Hint = c.String(),
                        Position = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .Index(t => t.FormID)
                .Index(t => t.SectionID);
            
            CreateTable(
                "dbo.FormCoreForms",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.FormCoreSections",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        FormID = c.Int(nullable: false),
                        Title = c.String(),
                        Position = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .Index(t => t.FormID);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.FormCoreSections", new[] { "FormID" });
            DropIndex("dbo.FormCoreFields", new[] { "SectionID" });
            DropIndex("dbo.FormCoreFields", new[] { "FormID" });
            DropTable("dbo.FormCoreSections");
            DropTable("dbo.FormCoreForms");
            DropTable("dbo.FormCoreFields");
        }
    }
}
