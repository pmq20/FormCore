using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using FormCore;
using Moq;
using Model = FormCore.Parenting;

namespace FormCoreTest.Fixtures {
  public class Parentings {
    public static Model Create(Mock<Context> mockContext) {
      var data = new List<Model> {
        new Model {ParentId = 1, ChildId = 2}
      };
      MockData(data, mockContext);
      return data[0];
    }

    public static void MockData(List<Model> list, Mock<Context> mockContext) {
      var set = new Mock<DbSet<Model>>().SetupData(list,
        objs => list.FirstOrDefault(b => b.ParentId == (int) objs[0] && b.ChildId == (int) objs[1]));
      mockContext.Setup(c => c.FormCoreParentings).Returns(set.Object);
    }
  }
}