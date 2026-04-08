using System;
using System.Collections.Generic;

namespace LearnMoreDAL.Models;

public partial class MyLearning
{
    public int MyLearningId { get; set; }

    public byte InstructorId { get; set; }

    public byte CourseId { get; set; }

    public DateOnly EnrolledDate { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual Instructor Instructor { get; set; } = null!;
}