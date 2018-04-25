using System.Data.Entity;
using System.Web;
using System.Web.Http;

namespace FormCoreSample {
  public class WebApiApplication : HttpApplication {
    protected void Application_Start() {
      Database.SetInitializer<Context>(null);
      GlobalConfiguration.Configure(WebApiConfig.Register);
      GlobalConfiguration.Configure(AutofacConfig.Register);
    }

    protected void Application_BeginRequest() {
      Response.Headers.Add("Access-Control-Allow-Origin", "*");
      Response.Headers.Add("Access-Control-Allow-Credentials", "true");
      Response.Headers.Add("Access-Control-Allow-Headers",
        "Authorization, Accept, Accept-Language, Content-Language, Content-Type, X-Requested-With");
      Response.Headers.Add("Access-Control-Expose-Headers", "X-Total-Count");
      Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      if ("OPTIONS" == Request.HttpMethod) {
        Response.StatusCode = 200;
        Response.End();
      }
    }
  }
}