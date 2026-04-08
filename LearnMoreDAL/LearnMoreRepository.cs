using LearnMoreDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;



namespace LearnMoreDAL
{
    public class LearnMoreRepository
    {
        private readonly LearnMoreDbContext context;
        public LearnMoreRepository(LearnMoreDbContext context)
        {
            this.context = context;
        }
        #region creating GetAllCategories
        public List<Category> GetAllCategories()
        {
            var categoriesList = context.Categories.FromSqlRaw("SELECT * FROM dbo.ufn_GetCategories()").ToList();
            return categoriesList;
        }
        #endregion
        #region creating GetAllCourses using TVF
        public List<Course> GetAllCourses()
        {
            List<Course> lstCourses;
            try
            {
                lstCourses = context.Courses.FromSqlRaw("SELECT * FROM ufn_ViewAllCourses()").ToList();

            }
            catch (Exception)
            {
                lstCourses = [];
            }
            return lstCourses;
        }

        #endregion
        #region creating GetCoursesOnCategoryId
        public List<Course> GetCoursesOnCategoryId(byte categoryId)
        {
            List<Course> lstCourses;
            try
            {
                lstCourses = context.Courses.Where(p => p.CourseCategoryId == categoryId).ToList();
            }
            catch (Exception)
            {
                lstCourses = [];
            }
            return lstCourses;
        }
        #endregion
        #region creating FilterCourses

        public Course FilterCourses(byte categoryId)
        {
            Course course;
            try
            {
                course = context.Courses.Where(c => c.CourseCategoryId == categoryId).FirstOrDefault();
            }
            catch (Exception)
            {
                course = null;
            }
            return course;
        }
        #endregion
        #region creating FilterCoursesUsingLike
        public List<Course> FilterCoursesUsingLike(string pattern)
        {
            List<Course> lstCourse;
            try
            {
                lstCourse = context.Courses.Where(c => EF.Functions.Like(c.CourseName, pattern)).ToList();
            }
            catch (Exception)
            {
                lstCourse = [];
            }
            return lstCourse;
        }
        #endregion
        #region creating RegisterInstructorUsingUSP
        public int RegisterInstructorUsingUSP(string UserName, string EmailId, string Password, string Gender, string Institution, string Department, int Experience, string Degree, string MobileNumber, out string message)
        {
            message = string.Empty;
            int returnResult;
            SqlParameter prmUsername = new SqlParameter("@UserName", UserName);
            SqlParameter prmEmail = new SqlParameter("@EmailId", EmailId);
            SqlParameter prmPassword = new SqlParameter("@Password", Password);
            SqlParameter prmGender = new SqlParameter("@Gender", Gender);
            SqlParameter prmInstitution = new SqlParameter("@Institution", Institution);
            SqlParameter prmDepartment = new SqlParameter("@Department", Department);
            SqlParameter prmExperience = new SqlParameter("@Experience", Experience);
            SqlParameter prmDegreesCompleted = new SqlParameter("@Degree", Degree);
            SqlParameter prmMobileNumber = new SqlParameter("@MobileNumber", MobileNumber);

            SqlParameter prmReturnResult = new SqlParameter("@ReturnResult", System.Data.SqlDbType.Int);
            prmReturnResult.Direction = System.Data.ParameterDirection.Output;

            SqlParameter prmMessage = new SqlParameter("@Message", System.Data.SqlDbType.NVarChar, 200);
            prmMessage.Direction = System.Data.ParameterDirection.Output;

            try
            {
                context.Database.ExecuteSqlRaw(

                   "EXEC @ReturnResult = dbo.usp_InstructorRegistration " +

                   "@UserName, @EmailId, @Password, @Gender, @Institution, " +

                   "@Department, @Experience, @Degree, @MobileNumber, @Message OUT",

                   prmReturnResult,
                   prmUsername,
                   prmEmail,
                   prmPassword,
                   prmGender,
                   prmInstitution,
                   prmDepartment,
                   prmExperience,
                   prmDegreesCompleted,
                   prmMobileNumber,
                   prmMessage

               );
                returnResult = Convert.ToInt32(prmReturnResult.Value);
                message = prmMessage.Value.ToString();
            }

            catch (Exception ex)
            {
                message = "Some error occurred, please try again!";
                Console.WriteLine(ex.Message);
                returnResult = -99;
            }
            return returnResult;
        }
        #endregion
        #region creating ValidateLoginCredentialsUsingUfn
        public int ValidateLoginCredentials(string emailId, string password)
        {
            int roleId = 0;
            try
            {
                roleId = context.AuthUsers.Select(u => LearnMoreDbContext.ufn_ValidateLoginCredentials(emailId, password)).FirstOrDefault();
            }
            catch (Exception)
            {
                roleId = 0;
            }
            return roleId;
        }
        #endregion
        #region Get InstructorId by Email
        public int GetInstructorIdByEmail(string emailId)
        {
            var instructor = context.Instructors
                .FirstOrDefault(i => i.EmailId == emailId);

            if (instructor == null)
                return 0;

            return instructor.InstructorId;
        }

        #endregion
        #region MyLearnings - Combined Search
        public List<MyLearning> SearchMyLearnings(
            byte instructorId,
            byte? courseId,
            DateOnly? enrolledDate)
        {
            List<MyLearning> myLearnings;

            try
            {
                var query = context.MyLearnings
                    .Where(m => m.InstructorId == instructorId)
                    .AsQueryable();

                if (courseId.HasValue)
                {
                    query = query.Where(m => m.CourseId == courseId.Value);
                }

                if (enrolledDate.HasValue)
                {
                    query = query.Where(m => m.EnrolledDate == enrolledDate.Value);
                }

                myLearnings = query
                    .OrderByDescending(m => m.EnrolledDate)
                    .ToList();
            }
            catch (Exception)
            {
                myLearnings = [];
            }

            return myLearnings;
        }
        #endregion
        #region Creating UpdateCourses
        public bool UpdateCourse(
        byte courseId,
        string newCourseName,
        byte newcourseCategoryId,

        string newCourseDuration,
        string newskillsToBeGained)
        {
            bool status = false;
            Course course = context.Courses.Find(courseId);
            try
            {
                if (course != null)
                {
                    course.CourseName = newCourseName;
                    course.CourseCategoryId = newcourseCategoryId;
                    course.CourseDuration = newCourseDuration;
                    course.SkillsToBeGained = newskillsToBeGained;
                    context.SaveChanges();
                    status = true;
                }
                else
                {
                    status = false;
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion
        #region Creating DeleteCourse




        public bool DeleteCourse(int courseId)
        {
            int returnResult = 0;
            bool status = false;

            SqlParameter prmCourseId = new SqlParameter("@CourseId", courseId);
            SqlParameter prmReturn = new SqlParameter("@ReturnValue", returnResult);
            prmReturn.Direction = System.Data.ParameterDirection.Output;

            try
            {
                context.Database.ExecuteSqlRaw(
                    "EXEC @ReturnValue = sp_DeleteCourse @CourseId",
                    prmReturn, prmCourseId);

                returnResult = Convert.ToInt32(prmReturn.Value);
                if (returnResult == 1)
                    status = true;
            }
            catch (Exception)
            {
                status = false;
            }

            return status;
        }


        #endregion
        #region creating AddCourse using USP
        public int AddCourse(string courseName, byte courseCategoryId, string courseDuration, string skillsToBeGained)
        {
            int returnresult = 0;
            SqlParameter prmCourseName = new SqlParameter("@CourseName", courseName);
            SqlParameter prmCourseCategoryId = new SqlParameter("@CourseCategoryId", courseCategoryId);
            SqlParameter prmCourseDuration = new SqlParameter("@CourseDuration", courseDuration);
            SqlParameter prmSkillsToBeGained = new SqlParameter("@SkillsToBeGained", skillsToBeGained);
            SqlParameter prmReturn = new SqlParameter("@ReturnValue", returnresult);
            prmReturn.Direction = System.Data.ParameterDirection.Output;
            try
            {
                context.Database.ExecuteSqlRaw("EXEC @ReturnValue=usp_AddCourse @CourseName,@CourseCategoryId,@CourseDuration,@SkillsToBeGained",
                   prmReturn, prmCourseName, prmCourseCategoryId, prmCourseDuration, prmSkillsToBeGained);
                returnresult = Convert.ToInt32(prmReturn.Value);
            }
            catch (Exception)
            {
                returnresult = -99;
            }
            return returnresult;
        }
        #endregion
        #region Can Enroll 
        public int CanEnroll(int instructorId, int courseId)
        {
            return context.Database
                .SqlQueryRaw<int>(
                    "SELECT dbo.fn_CanEnroll({0},{1})",
                    instructorId, courseId)
                .AsEnumerable()
                .FirstOrDefault();
        }

        #endregion
        #region Enroll Course
        public int EnrollCourse(int instructorId, int courseId)
        {
            int returnResult = 0;
            SqlParameter prmInstructorId = new SqlParameter("@InstructorId", instructorId);
            SqlParameter prmCourseId = new SqlParameter("@CourseId", courseId);
            SqlParameter prmReturn = new SqlParameter("@ReturnValue", returnResult);
            prmReturn.Direction = System.Data.ParameterDirection.Output;

            try
            {
                context.Database.ExecuteSqlRaw(
                    "EXEC @ReturnValue = sp_EnrollCourse @InstructorID, @CourseID",
                    prmReturn, prmInstructorId, prmCourseId);

                returnResult = Convert.ToInt32(prmReturn.Value);
            }
            catch (Exception)
            {
                returnResult = -99;
            }

            return returnResult;
        }

        #endregion

    }
}