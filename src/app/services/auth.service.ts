import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { User } from "../interfaces/user";
import UserCredential = firebase.auth.UserCredential;
import {firestore} from "firebase";


@Injectable()
export class AuthService {

  user: User;
  userCredential: UserCredential;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
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

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
        this.userCredential = credential
        this.user = credential.user
          this.updateUserData(this.user)
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////

  anonymousLogin() {
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

  emailLogin(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((userCredential) => {
         this.userCredential = userCredential
         this.user = userCredential.user
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
    console.log(user)
    const data: User = {
      uid: user.uid,
      displayName: user.displayName !== null && user.displayName !== undefined ? user.displayName : user.firstName + user.lastName,
      firstName: user.displayName !== null && user.displayName !== undefined ? user.displayName.split(" ")[0] : user.firstName,
      lastName: user.displayName !== null && user.displayName !== undefined ? user.displayName.split(" ")[1] : user.lastName,
      photoUrl: user.photoURL,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      isAnonymous: user.isAnonymous,
      contactInformation: {
        address: user.contactInformation.address,
        email: user.contactInformation.email,
        emailVerified: user.contactInformation.emailVerified,
        cellPhoneNumber: user.contactInformation.cellPhoneNumber,
        homePhoneNumber: user.contactInformation.homePhoneNumber,
        workPhoneNumber: user.contactInformation.workPhoneNumber,
        primaryContactMethod: user.contactInformation.primaryContactMethod,
        facebook: user.contactInformation.facebook,
        twitter: user.contactInformation.twitter,
        instagram: user.contactInformation.instagram,
        linkedin: user.contactInformation.linkedin,
        tiktok: user.contactInformation.tiktok,
        createBy: user.contactInformation.createBy,
        createDate: user.contactInformation.createDate,
        lastUpdateBy: this.userCredential.user.displayName,
        lastUpdateDate: firestore.Timestamp.now()
      },
      roles: {
        subscriber: false,
        editor: false,
        admin: false
      }
    }
    return userRef.set(data, { merge: true })
    //return userRef.set(Object.assign({},data), { merge: true })
  }




}
