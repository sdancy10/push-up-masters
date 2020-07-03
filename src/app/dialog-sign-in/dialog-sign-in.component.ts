import { Component, Inject, OnInit, Optional} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dialog-sign-in',
  templateUrl: './dialog-sign-in.component.html',
  styleUrls: ['./dialog-sign-in.component.css']
})
export class DialogSignInComponent implements OnInit {
  action:string;
  local_data: any;
  hide: true;
  signInForm: FormGroup;
  usernameFormControl = new FormControl('',[Validators.required]);
  passwordFormControl = new FormControl('',[Validators.required]);
  constructor(
    public dialogRef: MatDialogRef<DialogSignInComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA)
    public data: any,
    private formBuilder: FormBuilder,
    public authService: AuthService,)
     {
      this.local_data = {... data};
      this.action = this.local_data.action;
     }

  ngOnInit() {
    this.signInForm = this.formBuilder.group (
      {
        username: this.usernameFormControl,
        password: this.passwordFormControl,
        action: this.local_data.action
      }
    );
  }
  anonymousSignIn() {
    this.authService.anonymousLogin().then((data) => {
      if (this.authService.authenticated) {
        this.closeDialog('signin-success');
      }
    });
  }
  googleSignIn() {
    this.authService.googleLogin().then((data) => {
      if (this.authService.authenticated) {
        console.warn(this.authService)
        this.closeDialog('signin-success')
      }
    });
  }
  emailSignIn() {
    if (this.signInForm.invalid) {
      return;
    }
    this.authService.emailLogin(this.usernameFormControl.value,this.passwordFormControl.value).then((data) => {
      if (this.authService.authenticated) {
        console.warn(this.authService)
        this.closeDialog('signin-success')
      }
    });
  }

  closeDialog(reason: string){
    if (reason == null || reason == undefined) reason = "signin-cancel"
    this.dialogRef.close({event: reason});
  }
}
