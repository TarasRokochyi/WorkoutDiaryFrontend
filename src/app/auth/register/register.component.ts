import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../../_interfaces/register.model';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  genders: string[] = ['Male', 'Female', 'Other'];
  @Output() toggle = new EventEmitter();

  constructor(private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator]),
      // level: new FormControl(''),
      // gender: new FormControl(''),
      // weight: new FormControl(''),
      // height: new FormControl(''),
      // age: new FormControl('')
    });
  }

  private passwordMatchValidator(control: AbstractControl) : ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData }: any = this.registerForm.value;
      this.auth.register(registerData as Register).subscribe({
        next: (res) => {
          this.snackBar.open('Registration successful: ' + res);
          this.toggle.emit()
        },
        error: err => this.snackBar.open('Registration error: ' + err)
      });
    }
  }

  validateControl = (controlName: string) =>
    this.registerForm.get(controlName)?.invalid && this.registerForm.get(controlName)?.touched;

  hasError = (controlName: string, errorName: string) =>
    this.registerForm.get(controlName)?.hasError(errorName);
}
