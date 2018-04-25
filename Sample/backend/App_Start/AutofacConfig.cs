using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;

namespace FormCoreSample {
  public class AutofacConfig {
    public static void Register(HttpConfiguration config) {
      var builder = new ContainerBuilder();
      builder.RegisterType<Context>().InstancePerRequest();
      builder.RegisterApiControllers(Assembly.GetExecutingAssembly()).PropertiesAutowired();
      var container = builder.Build();
      config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
    }
  }
}