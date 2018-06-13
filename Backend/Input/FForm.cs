using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FForm {
    public int? ParentId { get; set; }
    [Required]
    public string Title { get; set; }
  }
}