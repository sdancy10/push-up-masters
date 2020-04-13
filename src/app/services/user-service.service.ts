import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';

@Injectable()
export class UserService {

  private usersCollection: AngularFirestoreCollection<User>;
  private usersList: User[] = new Array<User>();
  public users: string;
  private filter = '';
  private userCount = 0;

  constructor(private db: AngularFirestore, private auth: AuthService) {

    this.usersCollection = db.collection('/users');
    this.users = this.usersCollection.valueChanges.toString();
   }

  ngOnInit() {
  }

  public getUsers(): User[] {
    this.usersCollection.get().forEach(
      snapshot => {
        snapshot.forEach(
          doc => {
            let user =  doc.data();
            if (user.uid !== undefined) {
               this.usersList.push(user);
            }
          }
        )
      }
    );
    return this.usersList;
  }

  public addUser(): void {
    this.db.collection("users").doc(this.auth.currentUserId).set({
      createBy: "TestCreate",
      createDate: "Date Today",
      lastUpdateBy: "test",
      lastUpdateDate: "test",
      resume: "/resume/id",
      title: "test",
      userId: "test"

    })
  }

}
