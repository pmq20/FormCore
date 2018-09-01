using FormCore;
using FormCoreTest.Fixtures;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCoreTest.Helpers {
  class CommonFixtureCreator {
    public Mock<Context> mockContext;
    public Context context;
    public Form form;
    public Form form1;
    public Field[] fields;
    public Section[] sections;
    public Validation[] validataions;
    public CommonFixtureCreator(Mock<Context> _mockContext) {
      //mockContext = new Mock<Context>();
      mockContext = _mockContext;
      context = mockContext.Object;

      Forms.Create(mockContext);
      Parentings.Create(mockContext);
      form = Form.Load(context, 2);  // child
      form1 = Form.Load(context, 1); // parent
      sections = Sections.Create(mockContext, form);
      fields = Fields.Create(mockContext, form, sections[0]);
      validataions = Validations.Create(mockContext, form, fields);

      Drafts.Create(mockContext, form);

      TestBase.CalcVirtualAttributes(context);
    }
    public int GenFieldID() {
      return context.FormCoreFields.Select(f => f.Id).Max() + 1;
    }

    public int GenFormID() {
      return context.FormCoreForms.Select(f => f.Id).Max() + 1;
    }

    /// <summary>
    /// Mock auto created record, ID is 0. This can solve this problem
    /// </summary>
    public void UpdateNewID(Field newField) {
      newField.Id = this.GenFieldID();
      context.SaveChanges();
    }

    internal void UpdateNewID(Form newForm, int[] parents = null) {
      newForm.Id = this.GenFormID();
      context.SaveChanges();

      if (parents != null) {
        foreach(var pid in parents) {
          var parenting = new FormCore.Parenting {
            ParentId = pid,
            ChildId = newForm.Id,
          };
          context.FormCoreParentings.Add(parenting);
          context.SaveChanges();
        }
      }
    }
  }
}
