using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LearnMoreDAL.Models;

public partial class Course
{
    public byte CourseId { get; set; }

    public string CourseName { get; set; } = null!;

    public byte? CourseCategoryId { get; set; }

    public string CourseDuration { get; set; } = null!;

    public string SkillsToBeGained { get; set; } = null;

    [JsonIgnore]
    public virtual Category CourseCategory { get; set; } = null;
    [JsonIgnore]
    public virtual ICollection<MyLearning> MyLearnings { get; set; } = new List<MyLearning>();
}