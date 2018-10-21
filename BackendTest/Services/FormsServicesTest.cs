using System;
using System.Linq;
using FormCore;
using FormCore.Exceptions;
using FormCoreTest.Fixtures;
using FormCoreTest.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace FormCoreTest.Services {
  [TestClass]
  public class FormsServicesTest {
    private readonly CommonFixtureCreator creator;
    private readonly Mock<Context> mockContext;

    public FormsServicesTest() {
      mockContext = new Mock<Context>();
      creator = new CommonFixtureCreator(mockContext);
    }

    [TestMethod]
    public void UpdateParentsTest() {
      var context = creator.context;
      var form = creator.form;

      var newForms = Forms.CreateMore(mockContext);
      TestBase.CalcVirtualAttributes(context);


      Func<Form, bool> allow = f => true;

      var input = new FForm {ParentIds = new[] {newForms[0].Id, newForms[1].Id}};
      FormsServices<Form, OForm>.Update(context, form.Id, input, allow);
      form = Form.Load(context, form.Id);
      CollectionAssert.AreEqual(input.ParentIds, form.Parents.Select(p => p.Id).ToArray());

      input = new FForm {ParentIds = new[] {newForms[1].Id, newForms[2].Id}};
      FormsServices<Form, OForm>.Update(context, form.Id, input, allow);
      form = Form.Load(context, form.Id);
      CollectionAssert.AreEqual(input.ParentIds, form.Parents.Select(p => p.Id).ToArray());

      input = new FForm {ParentIds = new[] {newForms[0].Id, newForms[1].Id}};
      FormsServices<Form, OForm>.Update(context, form.Id, input, allow);
      form = Form.Load(context, form.Id);
      CollectionAssert.AreEquivalent(input.ParentIds, form.Parents.Select(p => p.Id).ToArray());
    }

    [TestMethod]
    public void ComplexTest() {
      var context = creator.context;
      var form = creator.form;
      var form1 = creator.form1;


      var input = new FForm {
        Title = form.Title,
        ParentIds = new[] {form.Id}
      };

      Action before = null;
      Action<Form> after = null;
      Func<Form, bool> allow = f => true;
      Func<Form, bool> disallow = f => false;

      // disallow create
      try {
        FormsServices<Form, OForm>.Create(context, input, before, disallow, after);
        Assert.Fail();
      } catch (Exception e) {
        Assert.IsTrue(e is AccessDenied);
      }

      // allow create
      var newFormId = FormsServices<Form, OForm>.Create(context, input, before, allow, after);
      var newForm = Form.Load(context, newFormId);
      creator.UpdateNewID(newForm, input.ParentIds);
      Assert.AreEqual(form.Id, newForm.Parents.First().Id);
      Assert.AreEqual(form.Title, newForm.Title);

      // show this form
      var newOForm = FormsServices<Form, OForm>.Show(context, newForm.Id, allow, f => new OForm(context, f));
      var actualSectionIds = newOForm.Sections.Select(s => s.Id).ToArray();
      var expectedSectionIds = form.Sections.Select(s => s.Id).ToArray();
      Assert.IsTrue(actualSectionIds.SequenceEqual(expectedSectionIds));

      // parentid cannot be itself
      try {
        input = new FForm {ParentIds = new[] {newForm.Id}};
        FormsServices<Form, OForm>.Update(context, newForm.Id, new FForm {ParentIds = new[] {newForm.Id}}, allow);
        Assert.Fail();
      } catch (Exception e) {
        Assert.IsTrue(e is AccessDenied);
      }

      // allow update, parent form#1 will have no fields
      newForm.InvokeMethod("ClearCache");
      form1.InvokeMethod("ClearCache");
      form.InvokeMethod("ClearCache");
      FormsServices<Form, OForm>.Update(context, newForm.Id, new FForm {ParentIds = new[] {form1.Id}}, allow);
      newForm = Form.Load(context, newForm.Id);
      CollectionAssert.AreEqual(new[] {form1.Id}, newForm.Parents.Select(f => f.Id).ToArray());
      Assert.AreEqual(form.Title, newForm.Title);

      // show this form
      newOForm = FormsServices<Form, OForm>.Show(context, newForm.Id, allow, f => new OForm(context, f));
      actualSectionIds = newOForm.Sections.Select(s => s.Id).ToArray();
      expectedSectionIds = form1.Sections.Select(s => s.Id).ToArray();
      Assert.IsTrue(actualSectionIds.SequenceEqual(expectedSectionIds));
    }
  }
}