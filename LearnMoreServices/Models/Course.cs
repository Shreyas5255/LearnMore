using System.ComponentModel.DataAnnotations;

namespace LearnMoreServices.Models
{
    public class Course
    {
        public byte? CourseId { get; set; }

        [Required]
        public string CourseName { get; set; } = null!;

        [Required]
        public byte? CourseCategoryId { get; set; }

        [Required]
        public string CourseDuration { get; set; } = null!;

        [Required]
        public string SkillsToBeGained { get; set; } = null!;
    }
}