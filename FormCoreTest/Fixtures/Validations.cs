using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormCore;
using Moq;
using System.Data.Entity;
using Model = FormCore.Validation;

namespace FormCoreTest.Fixtures
{
    public class Validations
    {
        public static Model Create(Mock<Context> mockContext, Form form, Field field)
        {
            var data = new List<Model> {
              new Model {
                  Id =1,
                  FormId = form.Id,
                  FieldId = field.Id,
                  Level = ValidationLevel.Error,
                  Type = ValidationType.Presence,
                  Message = "asdf",
              },
            };
            MockData(data, mockContext);
            return data[0];
        }
        public static void MockData(List<Model> list, Mock<Context> mockContext)
        {
            var data = list.AsQueryable();

            var mockSet = new Mock<DbSet<Model>>();

            mockSet.As<IQueryable<Model>>().Setup(m => m.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<Model>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<Model>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<Model>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());


            mockContext.Setup(m => m.FormCoreValidations).Returns(mockSet.Object);
        }
    }
}
