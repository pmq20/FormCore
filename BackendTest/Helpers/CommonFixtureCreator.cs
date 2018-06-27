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
      form = Form.Load(context, 2);
      form1 = Form.Load(context, 1);
      sections = Sections.Create(mockContext, form);
      fields = Fields.Create(mockContext, form, sections[0]);
      validataions = Validations.Create(mockContext, form, fields);

      Base.CalcVirtualAttributes(context);
    }
  }
}
