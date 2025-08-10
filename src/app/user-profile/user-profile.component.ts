import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../_interfaces/user.model';
import { UserService } from '../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { UpdatePassword } from '../_interfaces/updatePassword.model';

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
  personalForm: FormGroup;
  accountForm: FormGroup;
  private snackBar = inject(MatSnackBar)

  constructor(private dialog: MatDialog, private userService: UserService, private authService: AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;

      this.personalForm = this.fb.group({
        firstName: [user.firstName],
        lastName: [user.lastName],
        level: [user.level],
        gender: [user.gender],
        weight: [user.weight],
        height: [user.height],
        age: [user.age]
        });

        this.accountForm = this.fb.group({
          userName: [user.userName],
          email: [user.email]
      });
    });
  }

  cancelEdit(section: 'personal' | 'account') {
  if (section === 'personal') this.editPersonal = false;
  if (section === 'account') this.editAccount = false;
  }

  savePersonalInfo() {
    const updatedUser = { ...this.user, ...this.personalForm.value };
    this.userService.updateUser(updatedUser).subscribe({
      next: (data) => {
        this.user = data;
        this.snackBar.open('Personal info updated', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Update failed. Try again.', 'Close', { duration: 3000 });
      }
    })
    this.editPersonal = false;
  }

  saveAccountInfo() {
    const updatedUser = { ...this.user, ...this.accountForm.value };
    this.userService.updateUser(updatedUser).subscribe({
      next: (data) => {
        this.user = data;
        this.snackBar.open('Account info updated', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Update failed. Try again.', 'Close', { duration: 3000 });
      }
    })
    this.editAccount = false;
  }

  logout() {
    this.authService.revokeToken()
    //.subscribe({
    //  next: () => {
    //    this.snackBar.open("Logged out successfuly", "Close", { duration: 3000})
    //    this.router.navigateByUrl("")
    //  },
    //  error: () => {
    //    this.snackBar.open("Error while looging out", "Close", { duration: 3000})
    //  }
    //});
  }


  openPasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px'
    });

  dialogRef.afterClosed().subscribe(result => {
      if (result && result.currentPassword && result.newPassword) {
        const passwordData: UpdatePassword = {
          currentPassword: result.currentPassword,
          newPassword: result.newPassword
        };

        this.userService.updatePassword(passwordData).subscribe({
          next: () => {
            this.snackBar.open("Password changed successfully", "Close", { duration: 3000 });
          },
          error: (err) => {
            //console.log(err)
            this.snackBar.open("Error while changing password", "Close", { duration: 5000 });
          }
        });
      }
    });
  }
}