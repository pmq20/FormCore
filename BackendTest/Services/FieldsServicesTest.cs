using FormCore;
using FormCore.Exceptions;
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
    public void ComplexTest() {
      var form = creator.form;
      var context = creator.context;
      var field = creator.fields[0];
      Func<Form, bool> allow = (f => true);
      Func<Form, bool> disallow = (f => false);

      // create
      FField input = new FField {
        SectionId = form.Sections.First().Id,
        Column = "bb",
        ParentId = field.Id,
        FieldType = FieldType.BuiltIn,
        InputStyle = InputStyle.Input,
        Position = 0,
        DefaultValue = "",
      };
      var newFieldId = FieldsServices<Form, Field>.Create(context, form.Id, input, allow);
      var newField = context.FormCoreFields.Find(newFieldId);
      creator.UpdateNewID(newField);
      Assert.AreEqual(field.Label, newField.Label);

      // update
      Base.CalcVirtualAttributes(context);
      try {
        input = new FField { Position = 1, ParentId = newField.Id };
        FieldsServices<Form, Field>.Update(context, form.Id, newField.Id, input, allow);
        Assert.Fail();
      }catch (Exception e) {
        Assert.IsTrue(e is AccessDenied);
      }
      input = new FField { Position = 1, ParentId = creator.fields[1].Id };
      FieldsServices<Form, Field>.Update(context, form.Id, newField.Id, input, allow);
      newField = context.FormCoreFields.Find(newField.Id);
      Assert.AreEqual(1, newField.Position);
    }

  }
}
