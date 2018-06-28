using FormCore;
using FormCore.Exceptions;
using FormCoreTest.Fixtures;
using FormCoreTest.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace FormCoreTest.Services {
  [TestClass]
  public class FormsServicesTest {
    Mock<Context> mockContext;
    CommonFixtureCreator creator;
    public FormsServicesTest() {
      mockContext = new Mock<Context>();
      creator = new CommonFixtureCreator(mockContext);
    }

    [TestMethod]
    public void ComplexTest() {
      var context = creator.context;
      var form = creator.form;
      var form1 = creator.form1;
      

      var input = new FForm {
        ParentId = form.Id,
      };

      Action before = null;
      Action<Form> after = null;
      Func<Form, bool> allow = (f => true);
      Func<Form, bool> disallow = (f => false);

      // disallow create
      try {
        FormsServices<Form, OForm>.Create(context, input, before, disallow, after);
        Assert.Fail();
      } catch (Exception e) {
        Assert.IsTrue(e is AccessDenied);
      }

      // allow create
      var newFormId = FormsServices<Form, OForm>.Create(context, input, before, allow, after);
      var newForm = context.FormCoreForms.Find(newFormId);
      Assert.AreEqual(form.Id, newForm.ParentId);
      Assert.AreEqual(form.Title, newForm.Title);

      // show this form
      var newOForm = FormsServices<Form, OForm>.Show(context, newForm.Id, allow, f => new OForm(context, f));
      var actualSectionIds = newOForm.Sections.Select(s => s.Id).ToArray();
      var expectedSectionIds = form.Sections.Select(s => s.Id).ToArray();
      Assert.IsTrue(actualSectionIds.SequenceEqual(expectedSectionIds));


      // allow update, parent form#1 will have no fields
      newForm.InvokeMethod<Form>("ClearCache");
      form1.InvokeMethod<Form>("ClearCache");
      form.InvokeMethod<Form>("ClearCache");
      FormsServices<Form, OForm>.Update(context, newForm.Id, new FForm { ParentId = form1.Id }, allow);
      newForm = context.FormCoreForms.Find(newFormId);
      Assert.AreEqual(form1.Id, newForm.ParentId);
      Assert.AreEqual(form.Title, newForm.Title);

      // show this form
      newOForm = FormsServices<Form, OForm>.Show(context, newForm.Id, allow, f => new OForm(context, f));
      actualSectionIds = newOForm.Sections.Select(s => s.Id).ToArray();
      expectedSectionIds = form1.Sections.Select(s => s.Id).ToArray();
      Assert.IsTrue(actualSectionIds.SequenceEqual(expectedSectionIds));
    }
  }
}
