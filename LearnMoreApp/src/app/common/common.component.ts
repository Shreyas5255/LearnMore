import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  standalone: false,
  styleUrls: ['./common.component.css']
})
export class CommonComponent {
  title = 'LearnMoreApp';
  constructor(private readonly router: Router) { }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }



  goToCourses() {
    if (this.isLoggedIn() && (sessionStorage.getItem('userRole') === '2' || sessionStorage.getItem('userRole') === '3')) {
      this.router.navigate(['/courses']);
    } else {
      alert('Please login first as Instructor or User');
      this.router.navigate(['/login']);
    }

  }

  goToMyLearnings() {
    this.router.navigate(['/my-learnings']);
  }

  goToAddCourse() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/addCourse']);
    } else {
      alert('Please login first');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }


}
