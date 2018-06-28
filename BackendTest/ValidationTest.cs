using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using FormCore;
using System.Linq;
using Moq;
using System.Data.Entity;
using System.Collections.Generic;
using FormCoreTest.Fixtures;
using Newtonsoft.Json;
using FormCoreTest.Helpers;

namespace FormCoreTest {
  [TestClass]
  public class ValidationTest {
    Mock<Context> mockContext;
    CommonFixtureCreator creator;
    public ValidationTest() {
      mockContext = new Mock<Context>();
      creator = new CommonFixtureCreator(mockContext);
    }

    [TestMethod]
    public void DbTest() {
      var form = creator.form;
      var context = creator.context;

      // entityframework should work
      Assert.AreEqual(2, context.FormCoreForms.Count());
      Assert.AreEqual(1, context.FormCoreDrafts.Count());

      // virtual attributes should work
      Assert.AreEqual(2, form.Validations.Count);

      // find should work
      Assert.AreEqual(form.Id, context.FormCoreForms.Find(form.Id).Id);
    }

    [TestMethod]
    public void ValidateTest() {
      var form = creator.form;
      var context = creator.context;

      var draft = new Draft {
        FormId = form.Id,
      };

      draft.DataJson = JsonConvert.SerializeObject(new { AAA = "BBB", DDD__FORMCORE__EEE = "aa" });
      var errors = form.Validate(context, draft);
      //Console.WriteLine(errors);
      Assert.AreEqual(0, errors.Count);

      draft.DataJson = JsonConvert.SerializeObject(new { AAA = "", DDD__FORMCORE__EEE = "" });
      errors = form.Validate(context, draft);
      Assert.AreEqual(errors.Count, 2);

      draft.DataJson = JsonConvert.SerializeObject(new { });
      errors = form.Validate(context, draft);
      Assert.AreEqual(errors.Count, 2);
    }

    [TestMethod]
    public void ValidateTestOnlyError() {
      var form = creator.form;
      var context = creator.context;

      var draft = new Draft {
        FormId = form.Id,
      };

      draft.DataJson = JsonConvert.SerializeObject(new { AAA = "BBB", });
      var errors = form.Validate(context, draft, ValidationLevel.Error);
      Assert.AreEqual(errors.Count, 0);

      draft.DataJson = JsonConvert.SerializeObject(new { AAA = "", });
      errors = form.Validate(context, draft, ValidationLevel.Error);
      Assert.AreEqual(errors.Count, 0);

      draft.DataJson = JsonConvert.SerializeObject(new { });
      errors = form.Validate(context, draft, ValidationLevel.Error);
      Assert.AreEqual(errors.Count, 0);
    }
  }
}
