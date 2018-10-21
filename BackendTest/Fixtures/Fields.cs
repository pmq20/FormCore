using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using FormCore;
using Moq;
using Newtonsoft.Json;
using Model = FormCore.Field;

namespace FormCoreTest.Fixtures {
  public class Fields {
    public static Model[] Create(Mock<Context> mockContext, Form form, Section section) {
      var data = new List<Model> {
        new Model {
          Id = 1,
          FormId = form.Id,
          SectionId = section.Id,
          ColumnJson = JsonConvert.SerializeObject("AAA")
        },
        new Model {
          Id = 2,
          FormId = form.Id,
          SectionId = section.Id,
          ColumnJson = JsonConvert.SerializeObject(new[] {"DDD", "EEE"})
        }
      };
      MockData(data, mockContext);
      return data.ToArray();
    }

    public static void MockData(List<Model> list, Mock<Context> mockContext) {
      var set = new Mock<DbSet<Model>>().SetupData(list, objs => list.FirstOrDefault(b => b.Id == (int) objs.First()));
      mockContext.Setup(c => c.FormCoreFields).Returns(set.Object);
    }
  }
}