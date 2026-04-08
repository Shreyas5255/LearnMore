using System;
using System.Collections.Generic;

namespace LearnMoreDAL.Models;

public partial class Admin
{
    public byte AdminId {  get; set; }
    public string EmailId { get; set; } = null!;
    public string Password { get; set; }=null!;
    public int? RoleId { get; set; }
}
