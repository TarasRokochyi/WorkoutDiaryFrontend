import { Component } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: false,
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css'
})
export class ToggleComponent {

  isLoginMode = true;

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }
}
