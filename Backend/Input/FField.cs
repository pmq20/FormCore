using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FField {
    [Required]
    public string Label { get; set; }

    [Required]
    public int Position { get; set; }
  }
}