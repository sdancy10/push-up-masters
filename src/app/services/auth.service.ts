import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { User } from "../interfaces/user";
import UserCredential = firebase.auth.UserCredential;
import {firestore} from "firebase";
import { UserService } from './user-service.service';


@Injectable()
export class AuthService {

  user: User;
  userCredential: UserCredential;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private userService: UserService,
              private router:Router)
              {
                  this.afAuth.authState.subscribe( (user) =>
                    {
                      if (user) {
                        this.user = user;
                      } else {
                        this.userCredential = null;
                      }
                    }
                  );
              }

  // Returns true if user is logged in
// Returns true if user is logged in
get authenticated(): boolean {
  return this.userCredential !== null && this.userCredential !== undefined;
}

// Returns current user data
get currentUser(): any {
  return this.authenticated ? this.userCredential : null;
}

// Returns
get currentUserObservable(): any {
  return this.afAuth.authState
}

// Returns current user UID
get currentUserId(): string {
  return this.authenticated ? this.user.uid : '';
}

// Anonymous User
get currentUserAnonymous(): boolean {
  return this.authenticated ? this.user.isAnonymous : false
}

// Returns current user display name or Guest
get currentUserDisplayName(): string {
  if (!this.userCredential) { return 'Guest' }
  else if (this.currentUserAnonymous) { return 'Anonymous' }
  else { return this.userCredential['displayName'] || 'User without a Name' }
}

  //// Social Auth ////

  githubSignIn() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookSignIn() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterSignIn(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
        this.userCredential = credential
        let users: User[];
        this.userService.getUser(this.userCredential.user.uid).subscribe( data => {
           users = data.map( user =>  {
            return user.payload.doc.data() as User;
          }
          );
        users.forEach( user => {if (user.uid !== null || user.uid !== undefined) this.user = user})
        });
        this.updateUserData(this.user)
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////

  anonymousSignIn() {
    return this.afAuth.auth.signInAnonymously()
    .then((credential) => {
      this.userCredential = credential
      this.user = credential.user
      this.updateUserData(this.user)
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email:string, password:string, customUserProps?: User) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userCredential = userCredential
        this.user = userCredential.user
        this.user.firstName = customUserProps.firstName
        this.user.lastName = customUserProps.lastName
        this.user.roles = customUserProps.roles
        this.user.gender = customUserProps.gender
        this.user.dateOfBirth = customUserProps.dateOfBirth
        this.user.contactInformation = customUserProps.contactInformation
        this.updateUserData(this.user)
        return true
      })
      .catch(error => {
        console.log(error)
        return error;
      });
  }

  emailSignIn(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((userCredential) => {
        this.userCredential = userCredential
        let users: User[];
        this.userService.getUser(this.userCredential.user.uid).subscribe( data => {
           users = data.map( user =>  {
            return user.payload.doc.data() as User;
          }
          );
        users.forEach( user => {if (user.uid !== null || user.uid !== undefined) this.user = user})
        });
        this.updateUserData(this.user)
       })
       .catch(error => {
         console.log(error)
         return error;
       });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }


  //// Sign Out ////

  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/'])
  }

    ///// Role-based Authorization //////

    canRead(user: User): boolean {
      const allowed = ['admin', 'editor', 'subscriber']
      return this.checkAuthorization(user, allowed)
    }

    canEdit(user: User): boolean {
      const allowed = ['admin', 'editor']
      return this.checkAuthorization(user, allowed)
    }

    canDelete(user: User): boolean {
      const allowed = ['admin']
      return this.checkAuthorization(user, allowed)
    }

  //// Helpers ////
    private clean(obj) {
      for (var propName in obj) { 
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
          delete obj[propName];
        } else if (typeof obj[propName] === "object") {
          // Recurse here if the property is another object.
          this.clean(obj[propName])
        }
      }
      return obj;
    }

    // determines if user has matching role
    private checkAuthorization(user: User, allowedRoles: string[]): boolean {
      if (!user) return false
      for (const role of allowedRoles) {
        if ( user.roles[role] ) {
          return true
        }
      }
      return false
    }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${this.user.uid}`);
    user.contactInformation == undefined ? user.contactInformation = {} : ""
    user.roles == undefined ? user.roles = {} : ""
    user.gender == undefined? user.gender = "" : ""
    user.dateOfBirth == undefined? user.dateOfBirth = "" : ""

    console.log(user)
    const data: User = {
      uid: user.uid,
      displayName: user.displayName !== null && user.displayName !== undefined ? user.displayName : user.firstName + " " + user.lastName,
      firstName: user.firstName !== null && user.firstName !== undefined ? user.firstName : user.displayName.split(" ")[0],
      lastName: user.lastName !== null && user.lastName !== undefined ? user.lastName : user.displayName.split(" ")[1],
      photoUrl: user.photoURL,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      isAnonymous: user.isAnonymous,
      contactInformation: {
        address: user.contactInformation.address !== null && user.contactInformation.address !== undefined ? user.contactInformation.address : null,
        email: user.contactInformation.email !== null && user.contactInformation.email !== undefined ? user.contactInformation.email : user.email,
        emailVerified: user.contactInformation.emailVerified !== null && user.contactInformation.emailVerified !== undefined ? user.contactInformation.emailVerified : user.emailVerified,
        cellPhoneNumber: user.contactInformation.cellPhoneNumber !== null && user.contactInformation.cellPhoneNumber !== undefined ? user.contactInformation.cellPhoneNumber : null,
        homePhoneNumber: user.contactInformation.homePhoneNumber !== null && user.contactInformation.homePhoneNumber !== undefined ? user.contactInformation.homePhoneNumber : null,
        workPhoneNumber: user.contactInformation.workPhoneNumber !== null && user.contactInformation.workPhoneNumber !== undefined ? user.contactInformation.workPhoneNumber : null,
        primaryContactMethod: user.contactInformation.primaryContactMethod !== null && user.contactInformation.primaryContactMethod !== undefined ? user.contactInformation.primaryContactMethod : null,
        facebook: user.contactInformation.facebook !== null && user.contactInformation.facebook !== undefined ? user.contactInformation.facebook : null,
        twitter: user.contactInformation.twitter !== null && user.contactInformation.twitter !== undefined ? user.contactInformation.twitter : null,
        instagram: user.contactInformation.instagram !== null && user.contactInformation.instagram !== undefined ? user.contactInformation.instagram : null,
        linkedin: user.contactInformation.linkedin !== null && user.contactInformation.linkedin !== undefined ? user.contactInformation.linkedin : null,
        tiktok: user.contactInformation.tiktok !== null && user.contactInformation.tiktok !== undefined ? user.contactInformation.tiktok : null,
        createBy: user.contactInformation.createBy !== null && user.contactInformation.tiktok !== undefined ? user.contactInformation.createBy : user.displayName,
        createDate: user.contactInformation.createDate !== null && user.contactInformation.createDate !== undefined ? user.contactInformation.createDate : firestore.Timestamp.now(),
        lastUpdateBy: user.displayName !== null && user.displayName !== undefined ? user.displayName : user.firstName + " " + user.lastName,
        lastUpdateDate: firestore.Timestamp.now()
      },
      roles: {
        subscriber: user.roles.subscriber !== null && user.roles.subscriber !== null ? user.roles.subscriber : false,
        editor: user.roles.editor !== null && user.roles.editor !== null ? user.roles.editor : false,
        admin: user.roles.admin !== null && user.roles.admin !== null ? user.roles.admin : false
      }
    }
    return userRef.set(this.clean(data), { merge: true })
    //return userRef.set(Object.assign({},data), { merge: true })
  }




}
