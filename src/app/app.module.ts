import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { ToggleComponent } from './auth/toggle/toggle.component';
import { MenuComponent } from './menu/menu.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavLinkComponent } from './sidenav-link/sidenav-link.component';
import { JwtInterceptor } from './interceptors/JwtInterceptor';
import { RefreshTokenInterceptor } from './interceptors/RefreshTokenInterceptor';
import { CalendarComponent } from './calendar/calendar.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MatSnackBarAction } from '@angular/material/snack-bar';
import { WorkoutCreateComponent } from './workout/create-workout/create-workout.component';
import { ViewWorkoutsComponent } from './workout/view-workouts/view-workouts.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { WorkoutDetailsComponent } from './workout/workout-details/workout-details.component';
import { WorkoutFormComponent } from './workout/workout-form/workout-form.component';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CreateCustomExerciseComponent } from './create-custom-exercise/create-custom-exercise.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ToggleComponent,
    MenuComponent,
    SidenavComponent,
    SidenavLinkComponent,
    CalendarComponent,
    WorkoutCreateComponent,
    ViewWorkoutsComponent,
    WorkoutDetailsComponent,
    WorkoutFormComponent,
    UserProfileComponent,
    ChangePasswordDialogComponent,
    CreateCustomExerciseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatTimepickerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true
    },
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
