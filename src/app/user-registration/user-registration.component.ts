import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {last} from "rxjs/operators";
import {ContactInformation, Roles, User} from "../interfaces/user";
import {firestore} from "firebase";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSnackBarConfig} from "@angular/material/snack-bar";

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
  openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.duration = 4000
    config.panelClass = ['snackbar-pass']
    this._snackBar.open(message, action, config);
    this._snackBar.
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
      createBy: null,
      createDate: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
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
        this.openSnackBar("SUCCESS:","Registration completed succesfully.")
        this.router.navigate([''])
      } else this.openSnackBar("ERROR: ",response.message);
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
  selector: 'snack-bar-component-snack',
  templateUrl: 'snack-bar-component-snack.html',
  styles: [`
    .example-pizza-party {
      color: green;
    }
  `],
})
export class UserRegistrationSnackbarComponent {}
