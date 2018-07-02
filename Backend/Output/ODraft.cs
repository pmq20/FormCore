using System.Collections.Generic;

namespace FormCore {
  public class ODraft {
    public ODraft(Context db, Draft instance) {
      Id = instance.Id;
      FormId = instance.FormId;
      Data = instance.Data;
      var form = Form.Load(db, instance.FormId);
      Errors = form.Validate(db, instance);
    }

    public int Id { get; set; }
    public int FormId { get; set; }
    public dynamic Data { get; set; }
    public Dictionary<string, string[]> Errors { get; set; }
  }
}