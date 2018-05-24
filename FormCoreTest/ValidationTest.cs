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
        Mock<Context> mockContext;
        Form form;
        Field field;
        Validation validataion;
        public ValidationTest()
        {
            mockContext = new Mock<Context>();
            form = Forms.Create(mockContext);
            field = Fields.Create(mockContext, form);
            validataion = Validations.Create(mockContext, form, field);

            // calc virtual dbsets manually
            form.Validations = mockContext.Object.FormCoreValidations.Where(v => v.FormId == form.Id).ToList();
        }

        [TestMethod]
        public void DbTest()
        {
            Assert.AreEqual(form.Validations.Count, 1);

            Assert.AreEqual(mockContext.Object.FormCoreForms.Count(), 1);

            // find should work well
            Assert.AreEqual(mockContext.Object.FormCoreForms.Find(form.Id).Id, form.Id);
        }

        [TestMethod]
        public void Success()
        {
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
