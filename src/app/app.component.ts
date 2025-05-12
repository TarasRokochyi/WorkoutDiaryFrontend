import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WorkoutDiaryFrontend';

  constructor(private authService: AuthService){}

  isAuthenticated() {
    return this.authService.isLoggedIn$;
  }

}
