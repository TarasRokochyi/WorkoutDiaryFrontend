import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../_interfaces/user.model';
import { UserService } from '../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { UpdatePassword } from '../_interfaces/updatePassword.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user?: User;
  editPersonal = false;
  editAccount = false;
  saveSuccess = false;
  personalForm: FormGroup;
  accountForm: FormGroup;

  readonly levels = ['Beginner', 'Intermediate', 'Advanced'];
  readonly genders = ['Male', 'Female', 'Other'];

  private snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.buildForms(user);
    });
  }

  private buildForms(user: User): void {
    this.personalForm = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName:  [user.lastName,  Validators.required],
      level:     [user.level],
      gender:    [user.gender],
      weight:    [user.weight, [Validators.min(20),  Validators.max(300)]],
      height:    [user.height, [Validators.min(50),  Validators.max(250)]],
      age:       [user.age,    [Validators.min(1),   Validators.max(120)]]
    });

    this.accountForm = this.fb.group({
      userName: [user.userName, Validators.required],
      email:    [user.email,    [Validators.required, Validators.email]]
    });
  }

  get bmi(): number | null {
    if (!this.user?.weight || !this.user?.height) return null;
    return Math.round((this.user.weight / Math.pow(this.user.height / 100, 2)) * 10) / 10;
  }

  get bmiCategory(): string {
    const b = this.bmi;
    if (b === null) return '';
    if (b < 18.5) return 'Underweight';
    if (b < 25)   return 'Normal';
    if (b < 30)   return 'Overweight';
    return 'Obese';
  }

  get bmiClass(): string {
    const b = this.bmi;
    if (b === null) return '';
    if (b < 18.5) return 'bmi-warning';
    if (b < 25)   return 'bmi-normal';
    if (b < 30)   return 'bmi-warning';
    return 'bmi-danger';
  }

  cancelEdit(section: 'personal' | 'account'): void {
    if (section === 'personal') {
      this.personalForm.reset({
        firstName: this.user?.firstName,
        lastName:  this.user?.lastName,
        level:     this.user?.level,
        gender:    this.user?.gender,
        weight:    this.user?.weight,
        height:    this.user?.height,
        age:       this.user?.age
      });
      this.editPersonal = false;
    }
    if (section === 'account') {
      this.accountForm.reset({ userName: this.user?.userName, email: this.user?.email });
      this.editAccount = false;
    }
  }

  savePersonalInfo(): void {
    if (this.personalForm.invalid) return;
    const updatedUser = { ...this.user, ...this.personalForm.value };
    this.userService.updateUser(updatedUser).subscribe({
      next: (data) => {
        this.user = data;
        this.editPersonal = false;
        this.flashSuccess();
        this.snackBar.open('Personal info updated', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Update failed. Try again.', 'Close', { duration: 3000 });
      }
    });
  }

  saveAccountInfo(): void {
    if (this.accountForm.invalid) return;
    const updatedUser = { ...this.user, ...this.accountForm.value };
    this.userService.updateUser(updatedUser).subscribe({
      next: (data) => {
        this.user = data;
        this.editAccount = false;
        this.flashSuccess();
        this.snackBar.open('Account info updated', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Update failed. Try again.', 'Close', { duration: 3000 });
      }
    });
  }

  private flashSuccess(): void {
    this.saveSuccess = true;
    setTimeout(() => this.saveSuccess = false, 2000);
  }

  logout(): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { title: 'Log out', message: 'Are you sure you want to sign out?' }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.authService.revokeToken();
        this.router.navigateByUrl('');
      }
    });
  }

  deleteAccount(): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: {
        title: 'Delete account',
        message: 'This will permanently delete your account and all your workout data. This action cannot be undone.',
        confirmLabel: 'Delete',
        danger: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteAccount().subscribe({
          next: () => {
            this.authService.revokeToken();
            this.router.navigateByUrl('');
          },
          error: () => {
            this.snackBar.open('Failed to delete account. Try again.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openPasswordDialog(): void {
    this.dialog.open(ChangePasswordDialogComponent, { width: '400px' })
      .afterClosed().subscribe(result => {
        if (result?.currentPassword && result?.newPassword) {
          const passwordData: UpdatePassword = {
            currentPassword: result.currentPassword,
            newPassword: result.newPassword
          };
          this.userService.updatePassword(passwordData).subscribe({
            next: () => {
              this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
            },
            error: () => {
              this.snackBar.open('Error while changing password', 'Close', { duration: 5000 });
            }
          });
        }
      });
  }
}
