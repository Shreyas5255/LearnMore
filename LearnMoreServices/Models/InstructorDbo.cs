using System.ComponentModel.DataAnnotations;

namespace LearnMoreServices.Models
{
    public class InstructorDbo
    {
        [Required]
        public string UserName { get; set; } = null!;

        [Required]
        public string EmailId { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        public string Gender { get; set; } = null!;

        [Required]
        public string Institution { get; set; } = null!;

        [Required]
        public string Department { get; set; } = null!;

        [Required]
        public int? Experience { get; set; }

        [Required]
        public string Degree { get; set; } = null!;

        [Required]
        public string MobileNumber { get; set; } = null!;

        [Required]
        public int? RoleId { get; set; }
    }
}