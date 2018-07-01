namespace FormCore.Exceptions {
  public class NotFound : Error {
    public NotFound() : base() { }
    public NotFound(string msg) : base(msg) { }
  }
}