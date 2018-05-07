namespace FormCoreSample.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddMoreColumnsToFields : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FormCoreFields", "Help", c => c.String());
            AddColumn("dbo.FormCoreFields", "Required", c => c.Boolean(nullable: false));
            AddColumn("dbo.FormCoreFields", "RequiredMessage", c => c.String());
            AddColumn("dbo.FormCoreFields", "PlaceHolder", c => c.String());
            AddColumn("dbo.FormCoreFields", "Rows", c => c.Int(nullable: false));
            DropColumn("dbo.FormCoreFields", "Hint");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FormCoreFields", "Hint", c => c.String());
            DropColumn("dbo.FormCoreFields", "Rows");
            DropColumn("dbo.FormCoreFields", "PlaceHolder");
            DropColumn("dbo.FormCoreFields", "RequiredMessage");
            DropColumn("dbo.FormCoreFields", "Required");
            DropColumn("dbo.FormCoreFields", "Help");
        }
    }
}
