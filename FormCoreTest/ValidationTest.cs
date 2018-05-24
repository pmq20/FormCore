using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using FormCore;
using System.Linq;
using Moq;
using System.Data.Entity;
using System.Collections.Generic;
using FormCoreTest.Fixtures;
using Newtonsoft.Json;

namespace FormCoreTest
{
    [TestClass]
    public class ValidationTest
    {
        [TestMethod]
        public void Success()
        {
            var mockContext = new Mock<Context>();
            var form = Forms.Create(mockContext);
            var field = Fields.Create(mockContext, form);
            var validataion = Validations.Create(mockContext, form, field);

            form.Validations = mockContext.Object.FormCoreValidations.ToList();

            Assert.AreEqual(mockContext.Object.FormCoreForms.Count(), 1);
            Assert.AreEqual(form.Validations.Count, 1);

            var draft = new Draft
            {
                FormId = form.Id,
            };

            draft.DataJson = JsonConvert.SerializeObject(new { AAA = "BBB", });
            var errors = form.Validate(mockContext.Object, draft);
            Console.WriteLine(errors);
            Assert.AreEqual(errors.Count, 0);

            draft.DataJson = JsonConvert.SerializeObject(new { AAA = "", });
            errors = form.Validate(mockContext.Object, draft);
            Assert.AreEqual(errors.Count, 1);

            draft.DataJson = JsonConvert.SerializeObject(new { });
            errors = form.Validate(mockContext.Object, draft);
            Assert.AreEqual(errors.Count, 1);
        }
    }
}
