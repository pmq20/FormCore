using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FSection {
    [Required]
    public string Title { get; set; }

    [Required]
    public int Position { get; set; }
  }
}