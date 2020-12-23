import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import { DialogSignInComponent } from '../dialog-sign-in/dialog-sign-in.component';

@Component({
  selector: 'app-user-sign-in',
  templateUrl: './user-sign-in.component.html',
  styleUrls: ['./user-sign-in.component.scss']
})
export class UserSignInComponent implements OnInit {
  constructor(public authService: AuthService,
              private router:Router,
              public dialog: MatDialog) { }

  ngOnInit() {  }
  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogSignInComponent, {
      width: '450px',
      maxWidth: '90%',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
     //do nothing
    });
  }

  signOut() {
    this.authService.signOut()
    this.router.navigate(['']);
  }

}
