using System;
using System.Collections.Generic;

namespace LearnMoreDAL.Models;

public partial class Instructor
{
    public byte InstructorId { get; set; }

    public string UserName { get; set; } = null!;

    public string EmailId { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public string Institution { get; set; } = null!;

    public string Department { get; set; } = null!;

    public int Experience { get; set; }

    public string Degree { get; set; } = null!;

    public string MobileNumber { get; set; } = null!;

    public int? RoleId { get; set; }

    public virtual ICollection<MyLearning> MyLearnings { get; set; } = new List<MyLearning>();
}