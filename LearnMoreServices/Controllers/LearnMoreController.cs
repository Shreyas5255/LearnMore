using LearnMoreDAL;
using LearnMoreDAL.Models;
using Microsoft.AspNetCore.Mvc;


namespace LearnMoreServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LearnMoreController : Controller
    {
        readonly LearnMoreRepository repository;
        public LearnMoreController(LearnMoreRepository repository)
        {
            this.repository = repository;
        }

        #region HttpGet Method - GetAllCourses

        [HttpGet]
        public JsonResult GetAllCourses()
        {
            List<Course> courses;
            try
            {
                courses = repository.GetAllCourses();
            }
            catch (Exception)
            {
                courses = [];
            }
            return Json(courses);
        }
        #endregion

        #region GetAllCategories


        [HttpGet]
        public JsonResult GetAllCategories()
        {
            List<Category> categories;
            try
            {
                categories = repository.GetAllCategories();
            }
            catch (Exception)
            {
                categories = [];
            }
            return Json(categories);
        }
        #endregion

        #region HttpGet Method -  GetCoursesOnCategoryId
        [HttpGet]
        public JsonResult GetCoursesOnCategoryId(byte categoryId)
        {
            List<Course> courseList = null;

            try
            {
                courseList = repository.GetCoursesOnCategoryId(categoryId);
            }
            catch (Exception)
            {
                courseList = null;
            }
            return Json(courseList);
        }
        #endregion

        #region HttpPost Method - InstructorRegistration

        [HttpPost]
        public int RegisterInstructor(Models.InstructorDbo instructor)
        {
            int result;
            string message = "";
            try
            {
                result = repository.RegisterInstructorUsingUSP(instructor.UserName, instructor.EmailId, instructor.Password, instructor.Gender, instructor.Institution, instructor.Department, instructor.Experience!.Value, instructor.Degree, instructor.MobileNumber, out message);
            }
            catch (Exception)
            {

                result = -99;
            }
            return result;
        }
        #endregion

        #region HttpGet Method- ValidateLoginCredentials
        [HttpGet]
        public JsonResult ValidateLoginCredentials(string emailId, string password)
        {
            int roleId = 0;
            try
            {
                roleId = repository.ValidateLoginCredentials(emailId, password);
            }
            catch (Exception)
            {
                roleId = -1;
            }
            return Json(roleId);

        }
        #endregion

        #region HttpDelete - DeleteCourse
        [HttpDelete]
        public bool DeleteCourse(int courseId)
        {
            bool status = false;

            try
            {
                status = repository.DeleteCourse(courseId);
            }
            catch (Exception ex)
            {
                status = false;
                Console.WriteLine(ex.Message);
            }

            return status;
        }


        #endregion

        #region HttpGet Instructor by EmailId
        [HttpGet("getInstructorIdByEmail")]
        public JsonResult GetInstructorIdByEmail(string emailId)
        {
            try
            {
                var instructorId = repository.GetInstructorIdByEmail(emailId);

                if (instructorId == 0)
                    return Json(0);

                return Json(instructorId);
            }
            catch (Exception)
            {
                return Json(-99);
            }
        }

        #endregion

        #region HttpGet - Combined My Learnings Search
        [HttpGet]
        public JsonResult SearchMyLearnings(
            byte instructorId,
            byte? courseId = null,
            DateOnly? enrolledDate = null)
        {
            List<MyLearning> result;
            try
            {
                result = repository.SearchMyLearnings(
                    instructorId,
                    courseId,
                    enrolledDate
                );


            }
            catch (Exception)
            {
                result = [];

            }
            return Json(result);
        }
        #endregion

        # region HttpPut - UpdateCourse

        [HttpPut]
        public bool UpdateCourse(Models.Course course)
        {
            bool status = false;

            try
            {
                status = repository.UpdateCourse(
                    course.CourseId!.Value,
                    course.CourseName,
                    course.CourseCategoryId!.Value,
                    course.CourseDuration,
                    course.SkillsToBeGained
                );
            }
            catch (Exception)
            {
                status = false;
            }

            return status;
        }


        #endregion

        #region HttpPost-AddCourse
        [HttpPost]
        public JsonResult AddCourse(Models.Course course)
        {
            int result = 0;
            try
            {
                result = repository.AddCourse(course.CourseName, course.CourseCategoryId!.Value, course.CourseDuration, course.SkillsToBeGained);

            }
            catch (Exception)
            {
                result = -99;
            }
            return Json(result);
        }
        #endregion

        #region HTTP Post Enroll Course


        [HttpPost("EnrollCourse")]
        public int EnrollCourse(int instructorId, int courseId)
        {
            var canEnroll = repository.CanEnroll(instructorId, courseId);

            if (canEnroll == 0)
                return 0;

            return repository.EnrollCourse(instructorId, courseId);
        }
        #endregion
    }
}