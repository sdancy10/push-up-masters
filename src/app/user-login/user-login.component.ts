import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  constructor(public authService: AuthService, private router:Router) { }

  ngOnInit() {  }
  anonymousLogin() {
    this.authService.anonymousLogin().then((data) => {
      if (this.authService.authenticated) {
        this.router.navigate(['/home']);
      }
    });
  }
  googleLogin() {
    this.authService.googleLogin().then((data) => {
      if (this.authService.authenticated) {
        console.warn(this.authService)
        this.router.navigate(['/home']);
      }
    });
  }
  signOut() {
    this.authService.signOut()
    this.router.navigate(['']);
  }

}
