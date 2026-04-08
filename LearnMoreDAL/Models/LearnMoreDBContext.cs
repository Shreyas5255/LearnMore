using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Reflection.Emit;


namespace LearnMoreDAL.Models;

public partial class LearnMoreDbContext : DbContext
{
    public LearnMoreDbContext()
    {
    }

    public LearnMoreDbContext(DbContextOptions<LearnMoreDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<AuthUser> AuthUsers { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Instructor> Instructors { get; set; }

    public virtual DbSet<MyLearning> MyLearnings { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(
            new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build()
            .GetConnectionString("LearnMoreDBConnectionString"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("pk_AdminId");

            entity.HasIndex(e => e.EmailId, "uqe_AdminEmail").IsUnique();

            entity.Property(e => e.AdminId).ValueGeneratedOnAdd();
            entity.Property(e => e.EmailId)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasDefaultValue(1);
        });

        modelBuilder.Entity<AuthUser>(entity =>
        {
            entity.HasNoKey();

            entity.HasIndex(e => e.EmailId, "uqe_AuthEmail").IsUnique();

            entity.Property(e => e.EmailId)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("pk_CategoryId");

            entity.HasIndex(e => e.CategoryName, "uqe_CategoryName").IsUnique();

            entity.Property(e => e.CategoryId).ValueGeneratedOnAdd();
            entity.Property(e => e.CategoryName)
                .HasMaxLength(40)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("pk_CourseId");

            entity.HasIndex(e => e.CourseName, "uqe_CourseName").IsUnique();

            entity.Property(e => e.CourseId).ValueGeneratedOnAdd();
            entity.Property(e => e.CourseDuration)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CourseName)
                .HasMaxLength(40)
                .IsUnicode(false);
            entity.Property(e => e.SkillsToBeGained)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.CourseCategory).WithMany(p => p.Courses)
                .HasForeignKey(d => d.CourseCategoryId)
                .HasConstraintName("fk_CategoryId");
        });

        modelBuilder.Entity<Instructor>(entity =>
        {
            entity.HasKey(e => e.InstructorId).HasName("pk_InstructorId");

            entity.HasIndex(e => e.EmailId, "uqe_Email").IsUnique();

            entity.Property(e => e.InstructorId).ValueGeneratedOnAdd();
            entity.Property(e => e.Degree)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Department)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmailId)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Institution)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MobileNumber)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasDefaultValue(2);
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<MyLearning>(entity =>
        {
            entity.HasKey(e => e.MyLearningId).HasName("pk_MyLearningId");

            entity.HasIndex(e => new { e.InstructorId, e.CourseId }, "UQ_User_Course").IsUnique();

            entity.Property(e => e.EnrolledDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Course).WithMany(p => p.MyLearnings)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_CourseId");

            entity.HasOne(d => d.Instructor).WithMany(p => p.MyLearnings)
                .HasForeignKey(d => d.InstructorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_UserId");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("pk_UserId");

            entity.HasIndex(e => e.EmailId, "uqe_EmailId").IsUnique();

            entity.Property(e => e.UserId).ValueGeneratedOnAdd();
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EmailId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.MobileNumber)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Profession)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasDefaultValue(3);
        });

    }


    [DbFunction()]
    #region creating static method to invoke scalar-valued function
    public static int ufn_ValidateLoginCredentials(string emailId, string password)
    {
        return 0;
    }
    #endregion
}