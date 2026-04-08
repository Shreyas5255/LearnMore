import {
  Component
}

  from '@angular/core';

import {
  InstructorRegistrationService
}

  from '../services/instructor-registration-service/instructor-registration.service';

import {
  Router
}

  from '@angular/router';
import {
  IInstructor
}

  from '../interfaces/IInstructor';

@Component({

  selector: 'app-instructor-registration',

  templateUrl: './instructor-registration.component.html',
  standalone: false,
  styleUrls: ['./instructor-registration.component.css']

})

export class InstructorRegistrationComponent {

  instructor: IInstructor = {
    userName: "", emailId: "", password: "", gender: "", institution: "", department: "", experience: 0, degree: "", mobileNumber: "", roleId: 2
  }

    ;

  constructor(private readonly instructorService: InstructorRegistrationService, private readonly router: Router) {
  }

  onSubmit(form: any) {

    if (!form.valid) {
      return;
    }

    this.instructor = {
      userName: form.value.userName, emailId: form.value.emailId, password: form.value.password, gender: form.value.gender, institution: form.value.institution, department: form.value.department, experience: form.value.experience, degree: form.value.degree, mobileNumber: form.value.mobileNumber, roleId: 2
    }

      ;

    this.instructorService.registerInstructor(this.instructor)
      .subscribe({
        next: res => {
          alert("successfully registered");
          console.log(res);
          this.router.navigate(['/ ']);
        },
        error: err => {
          alert("Registration Failed");
          console.error(err);
        }
      });
  }
}
