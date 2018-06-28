using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormCore;
using Moq;
using System.Data.Entity;
using Model = FormCore.Draft;

namespace FormCoreTest.Fixtures {
  public class Drafts {
    public static Model Create(Mock<Context> mockContext, Form form) {
      var data = new List<Model> {
              new Model { Id=1, FormId = form.Id }
            };
      MockData(data, mockContext);
      return data[0];
    }
    public static void MockData(List<Model> list, Mock<Context> mockContext) {
      var set = new Mock<DbSet<Model>>().SetupData(list, objs => list.FirstOrDefault(b => b.Id == (int)objs.First()));
      mockContext.Setup(c => c.FormCoreDrafts).Returns(set.Object);
    }
  }
}
