import {
  Component, OnInit
}

  from '@angular/core';
import {
  Router
}

  from '@angular/router';
import {
  MyLearningsService
}

  from '../services/my-learnings-service/my-learnings.service';

@Component({
  selector: 'app-my-learnings',
  templateUrl: './my-learnings.component.html',
  standalone: false,
  styleUrls: ['./my-learnings.component.css']
})
export class MyLearningsComponent implements OnInit {
  instructorId !: number;
  courseId?: number;
  enrolledDate?: string;
  myLearnings: any[] = [];
  errorMsg: string = '';

  constructor(private readonly myLearningService: MyLearningsService, private readonly router: Router) {
  }

  ngOnInit(): void {
    const roleId = sessionStorage.getItem('userRole');
    const email = sessionStorage.getItem('userName');


    if (roleId !== '2') {
      alert('Access denied. Instructor only.');
      this.router.navigate(['/home']);
      return;
    }

    const storedId = sessionStorage.getItem('instructorId');

    if (storedId) {
      this.instructorId = +storedId;
      this.onSearch();
      return;
    }


    this.myLearningService.getInstructorIdByEmail(email!)
      .subscribe({
        next: (id) => {
          this.instructorId = id;
          sessionStorage.setItem('instructorId', id.toString());
          console.log('InstructorId stored, triggering search');
          this.onSearch();
        },
        error: (err) => {
          alert('Unable to fetch Instructor ID');
          console.error(err);
        }, complete: () => { console.log("Completed My Learnings"); }
      });
  }

  onSearch() {
    this.myLearningService.searchMyLearnings(this.instructorId, this.courseId, this.enrolledDate).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.myLearnings = response;
        } else {
          this.myLearnings = [];
        }
      },
      error: (err) => {
        this.errorMsg = err.error;
        alert('Search failed');
        this.myLearnings = [];
      },
      complete: () => {
        console.log('My learnings fetched successfully');
      }
    });
  }

  onClear() {
    this.courseId = undefined;
    this.enrolledDate = undefined;
    this.myLearnings = [];
    this.onSearch();
  }
}
