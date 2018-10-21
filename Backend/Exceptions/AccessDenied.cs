namespace FormCore.Exceptions {
  public class AccessDenied : Error {
    public AccessDenied() {
    }

    public AccessDenied(string msg) : base(msg) {
    }
  }
}