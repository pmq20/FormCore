using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using FormCore;
using Moq;
using Model = FormCore.Form;

namespace FormCoreTest.Fixtures {
  public class Forms {
    public static Model Create(Mock<Context> mockContext) {
      var data = new List<Model> {
        new Model {Id = 1, Title = "BBB"},
        new Model {Id = 2, Title = "CCC"}
      };
      MockData(data, mockContext);
      return data[0];
    }

    public static List<Model> CreateMore(Mock<Context> mockContext) {
      var data = new List<Model> {
        new Model {Id = 11, Title = "BBB"},
        new Model {Id = 12, Title = "CCC"},
        new Model {Id = 13, Title = "DDD"}
      };
      //MockData(data, mockContext);
      foreach (var model in data) {
        mockContext.Object.FormCoreForms.Add(model);
        mockContext.Object.SaveChanges();
      }
      return data;
    }

    public static void MockData(List<Model> list, Mock<Context> mockContext) {
      var set = new Mock<DbSet<Model>>().SetupData(list, objs => list.FirstOrDefault(b => b.Id == (int) objs.First()));
      mockContext.Setup(c => c.FormCoreForms).Returns(set.Object);
    }
  }
}