import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Exercise} from "../interfaces/Exercise";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private firestore: AngularFirestore) { }

  getExercises() {
    return this.firestore.collection('exercises').snapshotChanges();
  }

  createExercise(exercise: Exercise) {
    return this.firestore.collection('exercises').add(exercise);
  }

  updateExercise(exercise: Exercise) {
    //delete exercise.id;
    this.firestore.doc('exercises/' + exercise.id).update(exercise);
  }

  deleteExercise(exercise: Exercise) {
    this.firestore.doc('exercises/' + exercise.id).delete();
  }

}
