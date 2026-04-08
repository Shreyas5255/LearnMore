import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  validateLoginCredentials(emailId: string, password: string): Observable<number> {
    let params = "?emailId=" + emailId + "&password=" + password;
    return this.http.get<number>("https://localhost:7165/api/LearnMore/ValidateLoginCredentials" + params).pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(() => new Error(error.message || "Server Error"));
  }
}






