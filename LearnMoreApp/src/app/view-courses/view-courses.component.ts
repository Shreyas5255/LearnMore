import {
  Component, OnInit
}

  from '@angular/core';
import {
  ICategory
}

  from '../interfaces/ICategory';
import {
  ICourse
}

  from '../interfaces/ICourse';
import {
  MyLearningsService
}

  from '../services/my-learnings-service/my-learnings.service'
import {
  CourseService
}

  from '../services/course-service/course.service';
import {
  Router
}

  from '@angular/router';

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  standalone: false,
  styleUrls: ['./view-courses.component.css']
})
export class ViewCoursesComponent implements OnInit {
  courses: ICourse[] = [];
  categories: ICategory[] = [];
  filteredCourses: ICourse[] = [];
  searchByCourseName: string = "";
  searchByCategoryId: string = "0";
  imageSrc: string = "";
  showMsgDiv: boolean = false;
  errMsg: string = "";

  constructor(private readonly _courseService: CourseService, private readonly router: Router, private readonly _myLearningService: MyLearningsService) {
  }

  courseImageMap: Record<number, string>
    = {
      1: 'assets/LearnMore-images/ML.jpg', 2: 'assets/LearnMore-images/Java.jpg', 3: 'assets/LearnMore-images/PowerBI.jpg', 4: 'assets/LearnMore-images/DS.jpg', 7: 'assets/LearnMore-images/Communication.jpg', 5: 'assets/LearnMore-images/WebTechnologies.jpg', 6: 'assets/LearnMore-images/Discrete.jpg',
    }

    ;
  defaultCourseImage = 'assets/LearnMore-images/default.jpg';

  getCourseImage(courseId: number): string {
    return this.courseImageMap[courseId] ?? this.defaultCourseImage;
  }

  ngOnInit() {
    this.getCourses();

    this._courseService.getCategories().subscribe({
      next: (responseCategoryData) => {
        this.categories = responseCategoryData;

      },
      error: (responseCategoryError) => {
        this.categories = [];
        this.errMsg = responseCategoryError;
        console.log(this.errMsg);
      }

    });


    if (this.courses == null) {
      this.showMsgDiv = true;
    }

    this.filteredCourses = this.courses;
    this.imageSrc = "assets/LearnMore-images/img1.jpg";
  }


  getCourses() {
    this._courseService.getCourses().subscribe({
      next: (responseCourseData) => {
        this.courses = responseCourseData;
        this.filteredCourses = responseCourseData;
        this.showMsgDiv = false;

      },
      error: (responseCourseError) => {
        this.courses = [];
        this.errMsg = responseCourseError;
        console.log(this.errMsg);
      }

    });
  }

  searchCourse(courseName: string) {
    if (this.searchByCategoryId == "0") {
      this.filteredCourses = this.courses;
    }

    else {
      this.filteredCourses = this.courses?.filter(cour => cour.courseCategoryId.toString() == this.searchByCategoryId);
    }

    if (courseName != null || courseName == "") {
      this.searchByCourseName = courseName;
      this.filteredCourses = this.filteredCourses?.filter(cour => cour.courseName.toLowerCase().includes(courseName.toLowerCase()));
    }

    if (this.filteredCourses?.length == 0) {
      this.showMsgDiv = true;
    }

    else {
      this.showMsgDiv = false;
    }
  }

  searchCourseByCategory(categoryId: string) {
    if (this.searchByCourseName != null || this.searchByCourseName == "") {
      this.filteredCourses = this.courses?.filter(cour => cour.courseName?.toLowerCase().includes(this.searchByCourseName?.toLowerCase()));
    }

    else {
      this.filteredCourses = this.courses;
    }

    this.searchByCategoryId = categoryId;

    if (this.searchByCategoryId == "0") {
      this.filteredCourses = this.courses;
    }

    else {
      this.filteredCourses = this.filteredCourses?.filter(cour => cour.courseCategoryId.toString() == this.searchByCategoryId);
    }
  }

  updateCourse(cour: ICourse) {
    this.router.navigate(['/updateCourse', cour.courseId, cour.courseName, cour.courseCategoryId, cour.skillsToBeGained, cour.courseDuration]);
  }

  isInstructor(): boolean {
    return sessionStorage.getItem('userRole') === '2';
  }


  deleteCourse(courseId: number) {

    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    this._courseService.deleteCourse(courseId)
      .subscribe({
        next: () => {
          alert("Course deleted successfully");
          this.getCourses();
        },
        error: () => {
          alert("Some error occured please try again later");
        }
      });
  }



  enroll(courseId: number) {
    const email = sessionStorage.getItem('userName');

    if (!email) {
      alert("User information missing");
      return;
    }

    this._myLearningService.getInstructorIdByEmail(email)
      .subscribe(instructorId => {

        this._myLearningService.enrollCourse(instructorId, courseId)
          .subscribe({
            next: (result) => {

              if (result > 0) {
                alert("Course enrolled successfully");
                this.router.navigate(['/my-learnings']);
              }
              else if (result === 0) {
                alert("Already enrolled for the course");
                this.router.navigate(['/my-learnings']);
              }
              else {
                alert("Some error occurred, please try again later");
              }

            }, error: (err) => {
              alert("Some error occurred, please try again later");
            }
          });

      });
  }
}
