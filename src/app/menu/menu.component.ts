import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  activeLink = 'login';

  constructor(private router: Router) {}

  changeLink = (route: string) => {
    this.router.navigate([route])
  }

}
