import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Login } from '../../_interfaces/login.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

  }

  onSubmit = (loginValue: any) => {
    const loginModel: Login = {
      email: loginValue.email,
      password: loginValue.password
    }
    const apiUrl = 'user/token'
    if (this.loginForm.valid) {
      this.auth.login(apiUrl, loginModel).subscribe({
        next: res => console.log('Login success', res),
        error: err => console.error('Login failed', err)
      });
    }
  }

  validateControl = (controlName: string) => {
    if (this.loginForm.get(controlName)?.invalid && this.loginForm.get(controlName)?.touched)
      return true;
    
    return false;
  } 
  hasError = (controlName: string, errorName: string) => {
    if (this.loginForm.get(controlName)?.hasError(errorName))
      return true;
    
    return false;
  }
}
