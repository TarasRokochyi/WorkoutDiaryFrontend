import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  constructor(private http: HttpClient, private authService: AuthService){}

  ontestclick = () => {
    debugger
    this.authService.test().subscribe()

    //console.log('Clicked'); // Add this to confirm it's running
    //this.http.get('http://localhost:5208/api/user/test') // or whatever your backend URL is
    //  .subscribe({
    //    next: res => console.log('Success:', res),
    //    error: err => console.error('Error:', err)
    //  });
  }
}
