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
    public class Validation
    {
        [TestMethod]
        public void TestMethod1()
        {
            var mockContext = new Mock<Context>();
            var form = Forms.Create(mockContext);
            var field = Fields.Create(mockContext, form);
            var validataion = Validations.Create(mockContext, form, field);
            
            Assert.AreEqual(mockContext.Object.FormCoreForms.Count(), 1);

            var draft = new Draft
            {
                FormId = form.Id,
            };

            //draft.DataJson = JsonConvert.SerializeObject(new { AAA = "BBB", });
            //var errors = form.Validate(_context, draft);
            //Console.WriteLine(errors);
            //Assert.True(errors.Count == 0);

            //draft.DataJson = JsonConvert.SerializeObject(new { AAA = "", });
            //errors = form.Validate(_context, draft);
            //Assert.True(errors.Count == 1);
        }
    }
}
