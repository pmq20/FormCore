using System;

namespace FormCore.Exceptions {
  public class Error : Exception {
    public Error(): base() { }
    public Error(string msg) : base(msg) { }
  }
}