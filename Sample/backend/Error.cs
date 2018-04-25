using System;
using System.Net;

namespace FormCoreSample {
  public class Error : Exception {
    public Error() {
      Code = HttpStatusCode.BadRequest;
    }

    public Error(string message) : base(message) {
      Code = HttpStatusCode.BadRequest;
    }

    public HttpStatusCode Code { get; set; }
  }
}