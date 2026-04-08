
import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorRegistrationService {
  private readonly apiUrl = 'https://localhost:7165/api/LearnMore/RegisterInstructor';

  constructor(private readonly http: HttpClient) { }

  registerInstructor(instructorData: any): Observable<any> {

    return this.http.post<any>(

      `${this.apiUrl}`,

      instructorData

    ).pipe(catchError(this.errorHandler));

  }
  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || "Server Error"));
  }
}







