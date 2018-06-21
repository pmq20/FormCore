namespace FormCore {
  public class ODraft {
    public ODraft(Draft instance) {
      Id = instance.Id;
      FormId = instance.FormId;
      Data = instance.Data;
    }

    public int Id { get; set; }
    public int FormId { get; set; }
    public dynamic Data { get; set; }
  }
}