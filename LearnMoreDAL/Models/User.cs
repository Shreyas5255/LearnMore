using System;
using System.Collections.Generic;

namespace LearnMoreDAL.Models;

public partial class User
{
    public byte UserId { get; set; }

    public string EmailId { get; set; } = null;

    public string Password { get; set; } = null!;

    public string MobileNumber { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string Address { get; set; } = null!;

    public string Profession { get; set; } = null!;

    public int? RoleId { get; set; }
}