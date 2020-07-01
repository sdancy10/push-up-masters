import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import WhereFilterOp = firebase.firestore.WhereFilterOp;


@Injectable({
  providedIn: 'root'
})
export class ExerciseExecutionsService {
  constructor(private firestore: AngularFirestore) { }

  getExerciseExecutionsByUser(userId: string, exerciseId: string) {
    return this.firestore.collection('exercise-executions',
        ref =>
          ref.where("userId","==", userId)
            .where("exerciseId","==",exerciseId)
            .orderBy('creationDate')
            .orderBy('set')
    ).snapshotChanges();
  }

  getExerciseExecutionsByDate(operator: WhereFilterOp, timeStamp: Timestamp, exerciseId: string) {
    return this.firestore.collection('exercise-executions',
      ref =>
        ref.where("exerciseId","==", exerciseId)
          .where("creationDate", operator, timeStamp)
          .orderBy('creationDate')
          .orderBy('set')
    ).snapshotChanges();
  }

  getExerciseExecutions() {
    return this.firestore.collection('exercise-executions',
      ref =>
        ref.orderBy('creationDate')
          .orderBy('set')
    ).snapshotChanges();
  }

  createExercise(exerciseExecution: ExerciseExecution) {
    return this.firestore.collection('exercise-executions').add(exerciseExecution);
  }

  updateExercise(exerciseExecution: ExerciseExecution) {
    this.firestore.doc('exercise-executions/' + exerciseExecution.id).update(exerciseExecution);
  }

  deleteExercise(exerciseExecution: ExerciseExecution) {
    this.firestore.doc('exercise-executions/' + exerciseExecution.id).delete();
  }

  public getAggregateLineData(data,property: string[]): any[] {
    const groupedData = this.groupBy(data, property);
    const reducedData = [];

    for (let key in groupedData) {
      let initialValue = [];
      groupedData[key].forEach( currentValue => {
        initialValue.push(currentValue.reps);
      });

      reducedData.push({
        label: groupedData[key][0].userId,
        data: initialValue
      });
    }
    return reducedData;
  }

  public getAggregateData(data,property: string[]): any[] {
    data.forEach(exercise => exercise.creationDate = exercise.creationDate.toDate().toLocaleDateString());
    const groupedData = this.groupBy(data, property);
    const reducedData = [];

    for (let key in groupedData) {
      let initialValue = 0;
      let reps = groupedData[key].reduce((accumulator, currentValue) => {
        return accumulator + currentValue.reps;
      }, initialValue)
      initialValue = 0;
      let sets = groupedData[key].reduce((accumulator, currentValue) => {
        return accumulator += 1;
      }, initialValue)
      var date = groupedData[key][0].creationDate;

      reducedData.push({
        userId: groupedData[key][0].userId,
        sets: sets,
        reps: reps,
        creationDate: date,
      });
    }
    return reducedData;
  }
  private groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = '';
      property.forEach(p => key += obj[p])
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
}


