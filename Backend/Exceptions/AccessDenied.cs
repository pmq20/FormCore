namespace FormCore.Exceptions {
  public class AccessDenied : Error {
    public AccessDenied() : base() { }
    public AccessDenied(string msg) : base(msg) { }
  }
}
