using System.Linq;
using FormCore;
using FormCoreTest.Fixtures;
using Moq;

namespace FormCoreTest.Helpers {
  internal class CommonFixtureCreator {
    public Context context;
    public Field[] fields;
    public Form form;
    public Form form1;
    public Mock<Context> mockContext;
    public Section[] sections;

    public CommonFixtureCreator(Mock<Context> _mockContext) {
      //mockContext = new Mock<Context>();
      mockContext = _mockContext;
      context = mockContext.Object;
      Forms.Create(mockContext);
      Parentings.Create(mockContext);
      form = Form.Load(context, 2); // child
      form1 = Form.Load(context, 1); // parent
      sections = Sections.Create(mockContext, form);
      fields = Fields.Create(mockContext, form, sections[0]);
      TestBase.CalcVirtualAttributes(context);
    }

    public int GenFieldID() {
      return context.FormCoreFields.Select(f => f.Id).Max() + 1;
    }

    public int GenFormID() {
      return context.FormCoreForms.Select(f => f.Id).Max() + 1;
    }

    /// <summary>
    ///   Mock auto created record, ID is 0. This can solve this problem
    /// </summary>
    public void UpdateNewID(Field newField) {
      newField.Id = GenFieldID();
      context.SaveChanges();
    }

    internal void UpdateNewID(Form newForm, int[] parents = null) {
      newForm.Id = GenFormID();
      context.SaveChanges();

      if (parents != null)
        foreach (var pid in parents) {
          var parenting = new Parenting {
            ParentId = pid,
            ChildId = newForm.Id
          };
          context.FormCoreParentings.Add(parenting);
          context.SaveChanges();
        }
    }
  }
}