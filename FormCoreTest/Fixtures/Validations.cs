using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormCore;
using Moq;
using System.Data.Entity;
using Model = FormCore.Validation;

namespace FormCoreTest.Fixtures {
  public class Validations {
    public static Model Create(Mock<Context> mockContext, Form form, Field field) {
      var data = new List<Model> {
              new Model {
                  Id =1,
                  FormId = form.Id,
                  FieldId = field.Id,
                  Level = ValidationLevel.Warning,
                  Type = ValidationType.Presence,
                  Message = "asdf",
              },
            };
      MockData(data, mockContext);
      return data[0];
    }
    public static void MockData(List<Model> list, Mock<Context> mockContext) {
      var set = new Mock<DbSet<Model>>().SetupData(list, objs => list.FirstOrDefault(b => b.Id == (int)objs.First()));
      mockContext.Setup(c => c.FormCoreValidations).Returns(set.Object);
    }
  }
}
