using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using FormCore;
using System.Linq;
using Moq;
using System.Data.Entity;
using System.Collections.Generic;
using FormCoreTest.Fixtures;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FormCoreTest {
  [TestClass]
  public class JsonTest {
    public dynamic obj;
    [TestMethod]
    public void JsonTests() {
      var json = "{\"ProductDescription\":null,\"StartedAt__FORMCORE__ExpiredAt\":[\"2018 - 05 - 29T17: 35:57.185 + 08:00\",\"2018 - 05 - 30T17: 35:57.185 + 08:00\"],\"InceptionBackdating\":90,\"ExcludedStates\":[\"HI\"]}";
      obj = JsonConvert.DeserializeObject<dynamic>(json);

      // null
      Assert.AreEqual(null, obj.ProductDescription.Value);

      // array
      Assert.AreEqual(true, obj.StartedAt__FORMCORE__ExpiredAt.Type == JTokenType.Array);
      Assert.AreEqual("2018 - 05 - 29T17: 35:57.185 + 08:00", obj.StartedAt__FORMCORE__ExpiredAt[0].Value);
      Assert.AreEqual(2, obj.StartedAt__FORMCORE__ExpiredAt.Count);


      // integer
      Assert.AreEqual(true, obj.InceptionBackdating.Type == JTokenType.Integer);
      Assert.AreEqual(90, obj.InceptionBackdating.Value);


    }
  }
}
