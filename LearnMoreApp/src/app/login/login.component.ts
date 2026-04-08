import {
  Component
}

  from '@angular/core';
import {
  NgForm
}

  from '@angular/forms';
import {
  Router
}

  from '@angular/router';
import {
  LoginService
}

  from '../services/login-service/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  roleId: number = 0;
  errorMsg: string = "";
  msg: string = "";
  showDiv: boolean = false;

  constructor(private readonly _loginService: LoginService, private readonly router: Router) {
  }

  OnSubmission(loginForm: NgForm) {

    this._loginService.validateLoginCredentials(loginForm.value.email, loginForm.value.password).subscribe({
      next: (responseLoginStatus: number) => {
        this.roleId = responseLoginStatus;
        this.showDiv = true;
        if (this.roleId > 0) {
          this.msg = "Login Successful";
          sessionStorage.setItem('userName', loginForm.value.email);
          sessionStorage.setItem('userRole', this.roleId + "");
          sessionStorage.setItem('isLoggedIn', true + "");
          alert("Logged in successfully!");
          this.router.navigate(['/ ']);
        }
        else {
          this.showDiv = true;
          this.msg = "Try again with valid credentials.";
        }
      },
      error: (responseLoginError: any) => {
        this.errorMsg = responseLoginError;
      },
      complete: () => { console.log("SubmitLoginForm method executed successfully") }
    });
  }
}
