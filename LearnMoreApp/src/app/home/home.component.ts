import {
  Component
}

  from '@angular/core';
import {
  Router
}

  from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private readonly router: Router) {
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }



  goToCourses() {
    if (this.isLoggedIn() && (sessionStorage.getItem('userRole') === '2' || sessionStorage.getItem('userRole') === '3')) {
      this.router.navigate(['/courses']);
    }

    else {
      alert('Please login first as Instructor or User');
      this.router.navigate(['/login']);
    }
  }

  goToAddCourse() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/addCourse']);
    }

    else {
      alert('Please login first');
      this.router.navigate(['/login']);
    }
  }

  goToMyLearnings() {
    this.router.navigate(['/my-learnings']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
