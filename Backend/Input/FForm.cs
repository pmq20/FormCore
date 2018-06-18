using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FForm {
    [Required] public string Title { get; set; }

    public int? ParentId { get; set; }
  }
}