using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormCore;
using Moq;
using System.Data.Entity;
using Newtonsoft.Json;
using Model = FormCore.Field;

namespace FormCoreTest.Fixtures {
  public class Fields {
    public static Model[] Create(Mock<Context> mockContext, Form form) {
      var data = new List<Model> {
              new Model { Id=1, FormId = form.Id, ColumnJson= JsonConvert.SerializeObject("AAA"), },
              new Model { Id=2, FormId = form.Id, ColumnJson= JsonConvert.SerializeObject(new string[] {"DDD", "EEE" }), },
            };
      MockData(data, mockContext);
      return data.ToArray();
    }
    public static void MockData(List<Model> list, Mock<Context> mockContext) {
      var set = new Mock<DbSet<Model>>().SetupData(list, objs => list.FirstOrDefault(b => b.Id == (int)objs.First()));
      mockContext.Setup(c => c.FormCoreFields).Returns(set.Object);
    }
  }
}
