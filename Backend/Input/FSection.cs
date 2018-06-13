using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FSection {
    public int? ParentId { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public int? Position { get; set; }
  }
}