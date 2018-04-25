using System.Web.Http;
using System.Web.Http.ExceptionHandling;

namespace FormCoreSample {
  public static class WebApiConfig {
    public static void Register(HttpConfiguration config) {
      for (var i = config.Formatters.Count - 1; i >= 0; --i) {
        if (config.Formatters.JsonFormatter != config.Formatters[i]) {
          config.Formatters.RemoveAt(i);
        }
      }
      config.MapHttpAttributeRoutes();

      config.Services.Replace(typeof(IExceptionHandler), new GlobalExceptionHandler());
    }
  }
}