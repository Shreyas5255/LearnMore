
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyLearningsService {

  private readonly apiUrl = 'https://localhost:7165/api/LearnMore';

  constructor(private readonly http: HttpClient) { }


  getInstructorIdByEmail(email: string) {
    return this.http.get<number>(
      `${this.apiUrl}/GetInstructorIdByEmail/getInstructorIdByEmail`,
      { params: { emailId: email } }
    ).pipe(catchError(this.errorHandler));;
  }

  searchMyLearnings(instructorId: number, courseId?: number, enrolledDate?: string) {
    let params: any = { instructorId };

    if (courseId) params.courseId = courseId;
    if (enrolledDate) params.enrolledDate = enrolledDate;

    return this.http.get<any[]>(`${this.apiUrl}/SearchMyLearnings`, { params }).pipe(catchError(this.errorHandler));;
  }

  enrollCourse(instructorId: number, courseId: number) {
    return this.http.post<number>(
      `${this.apiUrl}/EnrollCourse/EnrollCourse?instructorId=${instructorId}&courseId=${courseId}`,
      {}).pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || "Server Error"));
  }
}
