using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace FormCoreTest.Helpers {
  public static class InvokeMethods {

    public static object InvokeMethod<T>(this T obj, string methodName, params object[] args) {
      var type = typeof(T);
      var method = type.GetTypeInfo().GetDeclaredMethod(methodName);
      return method.Invoke(obj, args);
    }
  }
}
