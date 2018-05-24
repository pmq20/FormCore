using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormCore;
using Moq;
using System.Data.Entity;
using Model = FormCore.Form;

namespace FormCoreTest.Fixtures
{
    public class Forms
    {
        public static Model Create(Mock<Context> mockContext)
        {
            var data = new List<Model> {
              new Model { Id=1, Title = "BBB" },
            };
            MockData(data, mockContext);
            return data[0];
        }
        public static void MockData(List<Model> list, Mock<Context> mockContext)
        {
            var set = new Mock<DbSet<Model>>().SetupData(list, objs => list.FirstOrDefault(b => b.Id == (int)objs.First()));
            mockContext.Setup(c => c.FormCoreForms).Returns(set.Object);
        }
    }
}
