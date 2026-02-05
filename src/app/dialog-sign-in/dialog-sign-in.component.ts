import { Component, Inject, OnInit, Optional} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dialog-sign-in',
  templateUrl: './dialog-sign-in.component.html',
  styleUrls: ['./dialog-sign-in.component.scss']
})
export class DialogSignInComponent implements OnInit {
  action: string;
  local_data: any;
  hide = true;
  signInForm: FormGroup;
  errorMessage: string = null;
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<DialogSignInComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public authService: AuthService
  ) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      username: this.usernameFormControl,
      password: this.passwordFormControl,
      action: this.local_data.action
    });
  }

  googleSignIn() {
    this.errorMessage = null;
    this.authService.googleSignIn().then((data) => {
      if (this.authService.authenticated) {
        this.closeDialog('signin-success');
      }
    }).catch(err => {
      this.errorMessage = 'Google sign-in failed. Please try again.';
    });
  }

  emailSignIn() {
    if (this.signInForm.invalid) {
      this.usernameFormControl.markAsTouched();
      this.passwordFormControl.markAsTouched();
      return;
    }
    this.errorMessage = null;
    this.authService.emailSignIn(
      this.usernameFormControl.value,
      this.passwordFormControl.value
    ).then((data) => {
      if (this.authService.authenticated) {
        this.closeDialog('signin-success');
      } else {
        this.errorMessage = 'Invalid email or password.';
      }
    }).catch(err => {
      this.errorMessage = 'Invalid email or password.';
    });
  }

  resetPassword() {
    const email = this.usernameFormControl.value;
    if (!email) {
      this.errorMessage = 'Enter your email above, then click "Forgot your password?"';
      return;
    }
    this.errorMessage = null;
    this.authService.resetPassword(email).then(() => {
      this.errorMessage = 'Password reset email sent. Check your inbox.';
    });
  }

  closeDialog(reason: string) {
    if (reason == null || reason == undefined) reason = 'signin-cancel';
    this.dialogRef.close({event: reason});
  }
}
