
import { Injectable } from '@angular/core';
import { ICourse } from '../../interfaces/ICourse';
import { ICategory } from '../../interfaces/ICategory';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courses: ICourse[] = [];
  categories: ICategory[] = [];


  constructor(private readonly http: HttpClient) { }

  getCourses(): Observable<ICourse[]> {
    let tempVar = this.http.get<ICourse[]>('https://localhost:7165/api/LearnMore/GetAllCourses').pipe(catchError(this.errorHandler));
    return tempVar;
  }
  getCategories(): Observable<ICategory[]> {
    let tempVar = this.http.get<ICategory[]>('https://localhost:7165/api/LearnMore/GetAllCategories').pipe(catchError(this.errorHandler));
    return tempVar;
  }
  getCourseByCategoryId(categoryId: number): Observable<ICourse[]> {
    let params = "?categoryId=" + categoryId;
    let tempVar = this.http.get<ICourse[]>('https://localhost:7165/api/LearnMore/GetCoursesOnCategoryId' + params).pipe(catchError(this.errorHandler));
    return tempVar;
  }
  updateCourse(
    courseId: number, courseName: string,
    courseCategoryId: number,
    courseDuration: string,
    skillsGained: string
  ): Observable<boolean> {

    let courseObj: ICourse = {
      courseId: courseId, courseName: courseName, courseCategoryId: courseCategoryId, courseDuration: courseDuration, skillsToBeGained: skillsGained
    };
    return this.http.put<boolean>(
      'https://localhost:7165/api/LearnMore/UpdateCourse',
      courseObj
    ).pipe(catchError(this.errorHandler));
  }
  addCourse(courseName: string, courseCategoryId: number, courseDuration: string, skillsToBeGained: string): Observable<boolean> {
    let courseObj: ICourse = {
      courseId: 0, courseName: courseName, courseCategoryId: courseCategoryId, courseDuration: courseDuration, skillsToBeGained: skillsToBeGained
    };
    return this.http.post<boolean>('https://localhost:7165/api/LearnMore/AddCourse', courseObj).pipe(catchError(this.errorHandler));
  }


  deleteCourse(courseId: number) {
    return this.http.delete<boolean>(
      `https://localhost:7165/api/LearnMore/DeleteCourse?courseId=${courseId}`, {}).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || "Server Error"));
  }
}
