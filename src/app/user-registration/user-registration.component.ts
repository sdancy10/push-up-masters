import { Component, OnInit, Inject, INJECTOR, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {last} from "rxjs/operators";
import {ContactInformation, Roles, User} from "../interfaces/user";
import {firestore} from "firebase";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSnackBarConfig} from "@angular/material/snack-bar";
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  public error: any;
  firstNameControl = new FormControl('',[Validators.required]);
  lastNameControl = new FormControl('',[Validators.required]);
  addressControl = new FormControl('',[]);
  emailControl = new FormControl('',[Validators.email])
  passwordControl = new FormControl('',[Validators.required])
  genderControl = new FormControl('',[]);
  dateOfBirthControl = new FormControl(new Date(),[Validators.required]);
  registrationForm: FormGroup;
  hide = true;

  constructor(private afService: AuthService, private router: Router, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group (
      {
        firstName: this.firstNameControl,
        lastName: this.lastNameControl,
        address: this.addressControl,
        email: this.emailControl,
        password: this.passwordControl,
        gender: this.genderControl,
        dateOfBirth: this.dateOfBirthControl
      }
    );
  }
  openSnackBar(message: string, action: string, success: boolean) {
    let config = new MatSnackBarConfig();
    config.data = {message,action}
    config.duration = 4000
    if (success) config.panelClass = 'snackbar-pass'
    else config.panelClass = 'snackbar-fail'
    this._snackBar.openFromComponent(UserRegistrationSnackbarComponent,config);
  }


  get f() { return this.registrationForm.controls; }
  //registers the user and logs them in
  register() {
    let event = 'registration';
    let firstName = this.registrationForm.controls.firstName.value;
    let lastName = this.registrationForm.controls.lastName.value;
    let address = this.registrationForm.controls.address.value;
    let email = this.registrationForm.controls.email.value;
    let password = this.registrationForm.controls.password.value;
    let gender = this.registrationForm.controls.gender.value;
    let dateOfBirth = this.registrationForm.controls.dateOfBirth.value;
    let userProps: User = {
      uid: null,
      gender: gender,
      dateOfBirth: firestore.Timestamp.fromDate(dateOfBirth),
      displayName: firstName + " " + lastName,
      firstName: firstName,
      lastName: lastName,
      createBy: firstName + " " + lastName,
      createDate: firestore.Timestamp.now(),
      lastUpdateBy: firstName + " " + lastName,
      lastUpdateDate: firestore.Timestamp.now(),
      contactInformation: {
        address: address,
        email: email,
        emailVerified: false,
        cellPhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,
        primaryContactMethod: null,
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null,
        tiktok: null,
        createBy: firstName + " " + lastName,
        createDate: firestore.Timestamp.now(),
        lastUpdateBy: firstName + " " + lastName,
        lastUpdateDate: firestore.Timestamp.now()
      },
      roles: {},
      isAnonymous: false,
      photoUrl: null
    }
    this.afService.emailSignUp(email, password,userProps).then( response => {
      if (response === true) {
        this.openSnackBar("Registration completed succesfully.","Dismiss",true)
        this.router.navigate([''])
      } else this.openSnackBar(response.message,"Dismiss",false);
    }).catch((error) => {
      this.error = error;
      console.log(this.error);
    });
  }

  goHome() {
    this.router.navigate(['']);
  }

}
@Component({
  selector: 'snack-bar-custom-component',
  templateUrl: 'snack-bar-custom-component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'user-registration-snackbar',
  }
})
export class UserRegistrationSnackbarComponent {
  /** Data that was injected into the snack bar. */
  data: {message: string, action: string};
  constructor(
    public snackBarRef: MatSnackBarRef<UserRegistrationSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) data: any) {
     this.data = data;
    }
   /** Performs the action on the snack bar. */
  action(): void {
    this.snackBarRef.dismissWithAction();
  }

  /** If the action button should be shown. */
  get hasAction(): boolean {
    return !!this.data.action;
  }
   
}
