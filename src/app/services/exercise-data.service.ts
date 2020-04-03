import { Injectable } from '@angular/core';
import {PushUpElement} from "../interfaces/push-up-element";
import {BehaviorSubject, concat, Observable, Subject} from "rxjs";
import {init} from "protractor/built/launcher";



@Injectable()
export class ExerciseDataService {
  private PUSHUP_DATA: PushUpElement[] = [
    {id: Math.random(), set: 1, name: 'Shane', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 2, name: 'Shane', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 3, name: 'Shane', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 4, name: 'Shane', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 5, name: 'Shane', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 6, name: 'Shane', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 7, name: 'Shane', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 8, name: 'Shane', reps: 35, time: '3/18/2020'},
    {id: Math.random(), set: 9, name: 'Shane', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 10, name: 'Shane', reps: 35, time: '3/18/2020'},
    {id: Math.random(), set: 11, name: 'Shane', reps: 20, time: '3/18/2020'},
    {id: Math.random(), set: 12, name: 'Shane', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 1, name: 'Kyle', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 2, name: 'Kyle', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 3, name: 'Kyle', reps: 35, time: '3/18/2020'},
    {id: Math.random(), set: 4, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 5, name: 'Kyle', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 6, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 7, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 8, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 9, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 10, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 11, name: 'Kyle', reps: 20, time: '3/18/2020'},
    {id: Math.random(), set: 12, name: 'Kyle', reps: 40, time: '3/18/2020'},
    {id: Math.random(), set: 13, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 14, name: 'Kyle', reps: 25, time: '3/18/2020'},
    {id: Math.random(), set: 15, name: 'Kyle', reps: 30, time: '3/18/2020'},
    {id: Math.random(), set: 1, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 2, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 3, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 4, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 5, name: 'Shane', reps: 30, time: '3/19/2020'},
    {id: Math.random(), set: 6, name: 'Shane', reps: 30, time: '3/19/2020'},
    {id: Math.random(), set: 7, name: 'Shane', reps: 30, time: '3/19/2020'},
    {id: Math.random(), set: 8, name: 'Shane', reps: 30, time: '3/19/2020'},
    {id: Math.random(), set: 9, name: 'Shane', reps: 30, time: '3/19/2020'},
    {id: Math.random(), set: 10, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 11, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 12, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 13, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 14, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 15, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 16, name: 'Shane', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 1, name: 'Kyle', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 2, name: 'Kyle', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 3, name: 'Kyle', reps: 30, time: '3/19/2020'},
    {id: Math.random(), set: 4, name: 'Kyle', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 5, name: 'Kyle', reps: 30, time: '3/19/2020'},
    {id: Math.random(), set: 6, name: 'Kyle', reps: 20, time: '3/19/2020'},
    {id: Math.random(), set: 7, name: 'Kyle', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 8, name: 'Kyle', reps: 25, time: '3/19/2020'},
    {id: Math.random(), set: 1, name: 'Shane', reps: 50, time: '3/20/2020'},
    {id: Math.random(), set: 2, name: 'Shane', reps: 35, time: '3/20/2020'},
    {id: Math.random(), set: 3, name: 'Shane', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 4, name: 'Shane', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 5, name: 'Shane', reps: 35, time: '3/20/2020'},
    {id: Math.random(), set: 6, name: 'Shane', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 7, name: 'Shane', reps: 50, time: '3/20/2020'},
    {id: Math.random(), set: 8, name: 'Shane', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 9, name: 'Shane', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 1, name: 'Kyle', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 2, name: 'Kyle', reps: 25, time: '3/20/2020'},
    {id: Math.random(), set: 3, name: 'Kyle', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 4, name: 'Kyle', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 5, name: 'Kyle', reps: 35, time: '3/20/2020'},
    {id: Math.random(), set: 6, name: 'Kyle', reps: 20, time: '3/20/2020'},
    {id: Math.random(), set: 7, name: 'Kyle', reps: 35, time: '3/20/2020'},
    {id: Math.random(), set: 8, name: 'Kyle', reps: 35, time: '3/20/2020'},
    {id: Math.random(), set: 9, name: 'Kyle', reps: 30, time: '3/20/2020'},
    {id: Math.random(), set: 10, name: 'Kyle', reps: 25, time: '3/20/2020'},
    {id: Math.random(), set: 11, name: 'Kyle', reps: 25, time: '3/20/2020'},
    {id: Math.random(), set: 12, name: 'Kyle', reps: 25, time: '3/20/2020'},
    {id: Math.random(), set: 13, name: 'Kyle', reps: 20, time: '3/20/2020'},
    {id: Math.random(), set: 14, name: 'Kyle', reps: 25, time: '3/20/2020'},
    {id: Math.random(), set: 15, name: 'Kyle', reps: 25, time: '3/20/2020'},
    {id: Math.random(), set: 1, name: 'Shane', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 2, name: 'Shane', reps: 50, time: '3/21/2020'},
    {id: Math.random(), set: 3, name: 'Shane', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 4, name: 'Shane', reps: 50, time: '3/21/2020'},
    {id: Math.random(), set: 5, name: 'Shane', reps: 40, time: '3/21/2020'},
    {id: Math.random(), set: 6, name: 'Shane', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 7, name: 'Shane', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 8, name: 'Shane', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 9, name: 'Shane', reps: 35, time: '3/21/2020'},
    {id: Math.random(), set: 10, name: 'Shane', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 11, name: 'Shane', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 1, name: 'Shane', reps: 30, time: '3/22/2020'},
    {id: Math.random(), set: 2, name: 'Shane', reps: 30, time: '3/22/2020'},
    {id: Math.random(), set: 1, name: 'Shane', reps: 0, time: '3/23/2020'},
    {id: Math.random(), set: 1, name: 'Shane', reps: 25, time: '3/24/2020'},
    {id: Math.random(), set: 2, name: 'Shane', reps: 25, time: '3/24/2020'},
    {id: Math.random(), set: 3, name: 'Shane', reps: 25, time: '3/24/2020'},
    {id: Math.random(), set: 1, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 2, name: 'Kyle', reps: 25, time: '3/21/2020'},
    {id: Math.random(), set: 3, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 4, name: 'Kyle', reps: 35, time: '3/21/2020'},
    {id: Math.random(), set: 5, name: 'Kyle', reps: 25, time: '3/21/2020'},
    {id: Math.random(), set: 6, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 7, name: 'Kyle', reps: 25, time: '3/21/2020'},
    {id: Math.random(), set: 8, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 9, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 10, name: 'Kyle', reps: 35, time: '3/21/2020'},
    {id: Math.random(), set: 11, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 12, name: 'Kyle', reps: 25, time: '3/21/2020'},
    {id: Math.random(), set: 13, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 14, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 15, name: 'Kyle', reps: 30, time: '3/21/2020'},
    {id: Math.random(), set: 1, name: 'Kyle', reps: 0, time: '3/22/2020'},
    {id: Math.random(), set: 1, name: 'Kyle', reps: 30, time: '3/23/2020'},
    {id: Math.random(), set: 2, name: 'Kyle', reps: 40, time: '3/23/2020'},
    {id: Math.random(), set: 3, name: 'Kyle', reps: 30, time: '3/23/2020'},
    {id: Math.random(), set: 4, name: 'Kyle', reps: 25, time: '3/23/2020'},
    {id: Math.random(), set: 5, name: 'Kyle', reps: 25, time: '3/23/2020'},
    {id: Math.random(), set: 6, name: 'Kyle', reps: 25, time: '3/23/2020'},
    {id: Math.random(), set: 7, name: 'Kyle', reps: 25, time: '3/23/2020'},
    {id: Math.random(), set: 1, name: 'Kyle', reps: 30, time: '3/24/2020'},
  ];
  private _pushup_data: Subject<Array<PushUpElement>> = new BehaviorSubject<Array<PushUpElement>>(this.PUSHUP_DATA);
  public readonly pushup_data: Observable<Array<PushUpElement>> = this._pushup_data.asObservable();

  constructor() { }

  public addRowData(row_obj) {
    let d = new Date();
    this.PUSHUP_DATA.push({
      id: d.getTime(),
      time: d.toLocaleDateString('en-US'),
      set: row_obj.set,
      reps: row_obj.reps,
      name: row_obj.name
    });
    let data = this.PUSHUP_DATA;
    this._pushup_data.next(data)
  }
  public updateRowData(row_obj){
    this.PUSHUP_DATA = this.PUSHUP_DATA.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.name = row_obj.name;
        value.reps = row_obj.reps;
        value.set = row_obj.set;
      }
      return true;
    });
    let data = this.PUSHUP_DATA;
    this._pushup_data.next(data)
  }

  public deleteRowData(row_obj){
    this.PUSHUP_DATA = this.PUSHUP_DATA.filter((value,key)=>{
      return value.id != row_obj.id;
    });
    let data = this.PUSHUP_DATA;
    this._pushup_data.next(data)
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
        label: groupedData[key][0].name,
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
      let time = groupedData[key][0].time;
      reducedData.push({
        name: groupedData[key][0].name,
        sets: sets,
        reps: reps,
        time: time,
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
