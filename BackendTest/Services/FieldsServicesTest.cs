using FormCore;
using FormCoreTest.Fixtures;
using FormCoreTest.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCoreTest.Services {
  [TestClass]
  public class FieldsServicesTest {
    Mock<Context> mockContext;
    CommonFixtureCreator creator;
    public FieldsServicesTest() {
      mockContext = new Mock<Context>();
      creator = new CommonFixtureCreator(mockContext);
    }

    [TestMethod]
    public void Create() {
      FField input = new FField {
        SectionId = creator.form.Sections.First().Id,
        Label = "aa",
        Column = "bb",
        ParentId = null,
        FieldType = FieldType.BuiltIn,
        InputStyle = InputStyle.Input,
        Position = 0,
        DefaultValue = "",
      };

      var newFieldId = FieldsServices<Form, Field>.Create(
        creator.context,
        creator.form.Id,
        input,
        form => true
      );
      var newField = creator.context.FormCoreFields.Find(newFieldId);
      Assert.AreEqual("aa", newField.Label);
    }

  }
}
