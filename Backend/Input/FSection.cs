using System.ComponentModel.DataAnnotations;

namespace FormCore {
  public class FSection {
    [Required] public int SectionId { get; set; }
    [Required] public string Title { get; set; }
    [Required] public double? Position { get; set; }

    public int? ParentId { get; set; }
  }
}