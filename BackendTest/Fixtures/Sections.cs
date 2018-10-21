using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using FormCore;
using Moq;
using Model = FormCore.Section;

namespace FormCoreTest.Fixtures {
  public class Sections {
    public static Model[] Create(Mock<Context> mockContext, Form form) {
      var data = new List<Model> {
        new Model {Id = 1, Title = "BBB", FormId = form.Id},
        new Model {Id = 2, Title = "CCC", FormId = form.Id}
      };
      MockData(data, mockContext);
      return data.ToArray();
    }

    public static void MockData(List<Model> list, Mock<Context> mockContext) {
      var set = new Mock<DbSet<Model>>().SetupData(list, objs => list.FirstOrDefault(b => b.Id == (int) objs.First()));
      mockContext.Setup(c => c.FormCoreSections).Returns(set.Object);
    }
  }
}