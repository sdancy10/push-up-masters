import {Component, OnInit, ViewChild} from '@angular/core';
import {Exercise} from "../interfaces/Exercise";
import {ExerciseService} from "../services/exercise.service";
import {DialogBoxExerciseComponent} from "../dialog-box-exercise/dialog-box-exercise.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {

  exercises: Exercise[];
  displayedColumns: {key,name}[];
  columnsToDisplay: string[] = [];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  constructor(private exerciseService: ExerciseService,public dialog: MatDialog) { }

  ngOnInit() {
    this.displayedColumns = [{key:'exerciseName', name:'Name'},
      {key:'exerciseType', name:'Type'},
      {key:'exerciseSummary', name:'Summary'},
      {key:'creationDate', name:'Created'},
      {key:'Edit', name:'Edit'}];
    this.displayedColumns.slice().forEach( pair => this.columnsToDisplay.push(pair.name));

    this.exerciseService.getExercises().subscribe(data => {
      this.exercises = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Exercise;
      })
    });
  }

  create(exercise: Exercise){
    this.exerciseService.createExercise(exercise);
  }

  update(exercise: Exercise) {
    this.exerciseService.updateExercise(exercise);
  }

  delete(exercise: Exercise) {
    this.exerciseService.deleteExercise(exercise);
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxExerciseComponent, {
      width: '450px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.create(result.data);
      }else if(result.event == 'Update'){
        this.update(result.data);
      }else if(result.event == 'Delete'){
        this.delete(result.data);
      }
    });
  }
}
