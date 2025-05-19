import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ToggleComponent } from './auth/toggle/toggle.component';
import { CalendarComponent } from './calendar/calendar.component';
import { WorkoutCreateComponent } from './workout/create-workout/create-workout.component';
import { ViewWorkoutsComponent } from './workout/view-workouts/view-workouts.component';
import { WorkoutDetailsComponent } from './workout/workout-details/workout-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateCustomExerciseComponent } from './create-custom-exercise/create-custom-exercise.component';

const routes: Routes = [
  //{ path: 'calendar', component: CalendarComponent},
  { path: 'create-workout', component: WorkoutCreateComponent},
  { path: 'view-workouts', component: ViewWorkoutsComponent },
  { path: 'workouts/:id', component: WorkoutDetailsComponent },
  { path: 'profile', component: UserProfileComponent},
  { path: 'create-custom-exercise', component: CreateCustomExerciseComponent},
  //{ path: 'create-custom-template', component: CreateCustomExerciseComponent},
  //{ path: "**", redirectTo: 'create-workout'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
