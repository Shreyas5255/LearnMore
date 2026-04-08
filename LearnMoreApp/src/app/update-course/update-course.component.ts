import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course-service/course.service';

@Component({
  selector: 'app-update-course',
  standalone: false,
  templateUrl: './update-course.component.html'

})
export class UpdateCourseComponent implements OnInit {

  userName: string = "";
  courseId: number = 0;
  courseName: string = "";
  courseCategoryId: number = 0;
  skillsToBeGained: string = "";
  courseDuration: string = "";
  status: boolean = false;
  errorMsg: string = "";
  constructor(private readonly _courseService: CourseService, private readonly route: ActivatedRoute, private readonly router: Router) { }
  ngOnInit() {
    this.courseId = Number(this.route.snapshot.params['courseId']);
    this.courseName = this.route.snapshot.params['courseName'];
    this.courseCategoryId = Number(this.route.snapshot.params['courseCategoryId']);
    this.courseDuration = this.route.snapshot.params['courseDuration'];
    this.skillsToBeGained = this.route.snapshot.params['skillsToBeGained'];
    this.userName = <string>
      sessionStorage.getItem("userName");
    if (this.userName == null) {
      this.router.navigate(['/login']);
    }

  }
  updateCourse(
    courseName: string,
    courseCategoryId: number,
    courseDuration: string,
    skillsGained: string
  ) {
    this._courseService
      .updateCourse(this.courseId, courseName, courseCategoryId, courseDuration, skillsGained)
      .subscribe({
        next: (res) => {
          if (res) {
            alert("Course Details updated successfully.");
          } else {
            alert("Update failed.");
          }
          this.router.navigate(['/courses']);
        }
        ,
        error: (err) => {
          console.log(err);
          alert("Some error occurred.");
          this.router.navigate(['/courses']);
        }, complete: () => { console.log("Updated Course"); }
      }
      );
  }
}
