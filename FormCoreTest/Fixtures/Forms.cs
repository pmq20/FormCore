using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormCore;
using Moq;
using System.Data.Entity;

namespace FormCoreTest.Fixtures
{
    public class Forms
    {
        public static Form Create(Mock<Context> mockContext)
        {
            var data = new List<Form> {
              new Form { Id=1, Title = "BBB" },
            };
            MockData(data, mockContext);
            return data[0];
        }
        public static void MockData(List<Form> list, Mock<Context> mockContext)
        {
            // https://msdn.microsoft.com/en-us/library/dn314429(v=vs.113).aspx

            var data = list.AsQueryable();

            var mockSet = new Mock<DbSet<Form>>();

            mockSet.As<IQueryable<Form>>().Setup(m => m.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<Form>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<Form>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<Form>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());


            mockContext.Setup(m => m.FormCoreForms).Returns(mockSet.Object);
        }
    }
}
