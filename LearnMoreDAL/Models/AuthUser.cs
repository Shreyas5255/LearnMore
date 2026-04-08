using System;
using System.Collections.Generic;


namespace LearnMoreDAL.Models;

public partial class AuthUser
{
    public string EmailId { get; set; } = null!;
    public string Password { get; set; } = null!;
    public int RoleId { get; set; }
}
