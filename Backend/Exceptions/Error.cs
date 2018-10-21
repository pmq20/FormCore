using System;

namespace FormCore.Exceptions {
  public class Error : Exception {
    public Error() {
    }

    public Error(string msg) : base(msg) {
    }
  }
}