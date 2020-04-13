import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { User } from "../interfaces/user";


@Injectable()
export class AuthService {

  user: User;
  userCredential: any;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private router:Router)
              {
                  this.afAuth.authState.subscribe( (userCredential) =>
                    {
                      if (userCredential) {
                        this.userCredential = userCredential;
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
  return this.authenticated ? this.userCredential.uid : '';
}

// Anonymous User
get currentUserAnonymous(): boolean {
  return this.authenticated ? this.userCredential.isAnonymous : false
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
          this.user = credential.user
          this.updateUserData(this.user)
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
    .then((user) => {
      this.user = this.userCredential
      this.updateUserData(this.user)
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email:string, password:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userCredential = userCredential
        this.updateUserData(this.userCredential)
      })
      .catch(error => console.log(error));
  }

  emailLogin(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((userCredential) => {
         this.userCredential = userCredential
         this.updateUserData(this.userCredential)
       })
       .catch(error => console.log(error));
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

  private updateUserData(userCredential) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${this.user.uid}`);
    const data: User = {
      uid: userCredential.uid,
      contactInformation: {
        id: userCredential.uid,
        email: userCredential.email,
        emailVerified: userCredential.emailVerified,
        cellPhoneNumber: userCredential.phoneNumber
      },
      photoUrl: userCredential.photoURL,
      roles: {
        subscriber: false
      }
    }
    return userRef.set(data, { merge: true })
  }




}
