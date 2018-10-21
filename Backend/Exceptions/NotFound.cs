namespace FormCore.Exceptions {
  public class NotFound : Error {
    public NotFound() {
    }

    public NotFound(string msg) : base(msg) {
    }
  }
}