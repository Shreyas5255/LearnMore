import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { InstructorRegistrationComponent } from './instructor-registration/instructor-registration.component';
import { ViewCoursesComponent } from './view-courses/view-courses.component';
import { MyLearningsComponent } from './my-learnings/my-learnings.component';
import { CommonComponent } from './common/common.component';
import { AuthService } from './services/auth-service/auth-service.service';
import { UpdateCourseComponent } from './update-course/update-course.component';
import { AddCourseComponent } from './add-course/add-course.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: '', component: CommonComponent, children: [

      { path: 'login', component: LoginComponent },
      { path: 'register', component: InstructorRegistrationComponent },
      { path: 'courses', component: ViewCoursesComponent, canActivate: [AuthService] },
      { path: 'my-learnings', component: MyLearningsComponent },
      { path: 'updateCourse/:courseId/:courseName/:courseCategoryId/:courseDuration/:skillsGained', component: UpdateCourseComponent },
      { path: 'addCourse', component: AddCourseComponent }

    ]
  },


  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
