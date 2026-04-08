import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course-service/course.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ICategory } from '../interfaces/ICategory';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  standalone:false,
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  status: boolean = false;
  errorMsg: string = "";
  categories: ICategory[] = [];
  roleId: string = "";

  constructor(private readonly _courseService: CourseService, private readonly router: Router) {

  }
  ngOnInit() {
    this.roleId = <string>sessionStorage.getItem('userRole');
    if (this.roleId == null || this.roleId == '3') {
      alert("Access Denied! Please, login as Admin or Instructor")
      this.router.navigate(['/login']);
    }
    this._courseService.getCategories().subscribe({
      next: (responseCategoryData: ICategory[]) => {
        this.categories = responseCategoryData;

      },
      error: (responseCategoryError: any) => {
        this.categories = [];
        this.errorMsg = responseCategoryError;
        console.log(this.errorMsg);
      },
      complete: () => { console.log("Get Categories executed successfully") }
    });
  }
  addCourse(addCourseForm: NgForm) {
    this._courseService.addCourse(addCourseForm.value.courseName, addCourseForm.value.courseCategoryId, addCourseForm.value.courseDurationValue + ' ' + addCourseForm.value.courseDurationUnit, addCourseForm.value.skillsToBeGained)
      .subscribe({
        next: (resStatus: boolean) => {
          this.status = resStatus;
          if (this.status) {
            alert("Course added successfully!");
            this.router.navigate(['/courses']);

          }
          else {
            alert("Unable to add the course!");
            this.router.navigate(['/courses']);

          }
        },
        error: (resError: any) => {

          this.errorMsg = resError;
          alert("Some Error Occured, Please try again!");
          this.router.navigate(['/courses']);
        },
        complete: () => { console.log("AddCourse Method executed successfully!") }
      });
  }

}
