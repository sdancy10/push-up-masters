import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Exercise} from "../interfaces/Exercise";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";

@Injectable({
  providedIn: 'root'
})
export class ExerciseExecutionsService {
  constructor(private firestore: AngularFirestore) { }

  getExerciseExecutions() {
    return this.firestore.collection('exercise-executions',
        ref => ref.orderBy('creationDate').orderBy('set')
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
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(groupedData[key][0].creationDate);
      let time = t.toLocaleDateString();

      reducedData.push({
        userId: groupedData[key][0].userId,
        sets: sets,
        reps: reps,
        creationDate: time,
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


