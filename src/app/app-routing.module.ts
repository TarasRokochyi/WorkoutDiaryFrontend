import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ToggleComponent } from './auth/toggle/toggle.component';
import { CalendarComponent } from './calendar/calendar.component';
import { WorkoutCreateComponent } from './workout/create-workout/create-workout.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent},
  { path: 'create-workout', component: WorkoutCreateComponent},
  { path: "**", redirectTo: 'create-workout'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
