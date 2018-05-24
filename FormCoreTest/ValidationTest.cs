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
        Context context;
        Form form;
        Field field;
        Validation validataion;
        public ValidationTest()
        {
            mockContext = new Mock<Context>();
            context = mockContext.Object;

            form = Forms.Create(mockContext);
            field = Fields.Create(mockContext, form);
            validataion = Validations.Create(mockContext, form, field);

            Base.CalcVirtualAttributes(context);
        }

        [TestMethod]
        public void DbTest()
        {
            // entityframework should work
            Assert.AreEqual(context.FormCoreForms.Count(), 1);

            // virtual attributes should work
            Assert.AreEqual(form.Validations.Count, 1);

            // find should work
            Assert.AreEqual(context.FormCoreForms.Find(form.Id).Id, form.Id);
        }

        [TestMethod]
        public void Success()
        {
            var draft = new Draft
            {
                FormId = form.Id,
            };

            draft.DataJson = JsonConvert.SerializeObject(new { AAA = "BBB", });
            var errors = form.Validate(context, draft);
            Console.WriteLine(errors);
            Assert.AreEqual(errors.Count, 0);

            draft.DataJson = JsonConvert.SerializeObject(new { AAA = "", });
            errors = form.Validate(context, draft);
            Assert.AreEqual(errors.Count, 1);

            draft.DataJson = JsonConvert.SerializeObject(new { });
            errors = form.Validate(context, draft);
            Assert.AreEqual(errors.Count, 1);
        }
    }
}
