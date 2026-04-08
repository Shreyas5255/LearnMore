import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ViewCoursesComponent } from './view-courses/view-courses.component';
import { MyLearningsComponent } from './my-learnings/my-learnings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstructorRegistrationComponent } from './instructor-registration/instructor-registration.component';
import { CommonComponent } from './common/common.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdateCourseComponent } from './update-course/update-course.component';
import { AddCourseComponent } from './add-course/add-course.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    InstructorRegistrationComponent,
    ViewCoursesComponent,
    MyLearningsComponent,
    CommonComponent,
    InstructorRegistrationComponent,
    UpdateCourseComponent,
    AddCourseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
