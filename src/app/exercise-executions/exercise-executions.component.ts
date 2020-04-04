import {Component, OnInit, ViewChild} from '@angular/core';
import {ExerciseExecutionsService} from "../services/exercise-executions.service";
import {ExerciseService} from "../services/exercise.service";
import {MatTable} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {Exercise} from "../interfaces/Exercise";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";
import {DialogBoxExerciseComponent} from "../dialog-box-exercise/dialog-box-exercise.component";
import {DialogBoxExerciseExecutionComponent} from "../dialog-box-exercise-execution/dialog-box-exercise-execution.component";

@Component({
  selector: 'app-exercise-executions',
  templateUrl: './exercise-executions.component.html',
  styleUrls: ['./exercise-executions.component.css']
})
export class ExerciseExecutionsComponent implements OnInit {
  exercises: Exercise[];
  exerciseExecutions: ExerciseExecution[];
  displayedColumns: {key,name}[];
  columnsToDisplay: string[] = [];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  constructor(private exerciseExecutionsService: ExerciseExecutionsService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.displayedColumns = [
      {key:'user', name:'User'},
      {key:'exercise', name:'Exercise'},
      {key:'set', name:'Set'},
      {key:'reps', name:'Reps'},
      {key:'duration', name:'Duration'},
      {key:'Edit', name:'Edit'}];
    this.displayedColumns.slice().forEach( pair => this.columnsToDisplay.push(pair.name));



    this.exerciseExecutionsService.getExerciseExecutions().subscribe(data => {
      this.exerciseExecutions = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as ExerciseExecution;
      })
    });

  }
  create(exerciseExecution: ExerciseExecution){
    this.exerciseExecutionsService.createExercise(exerciseExecution);
  }

  update(exerciseExecution: ExerciseExecution) {
    this.exerciseExecutionsService.updateExercise(exerciseExecution);
  }

  delete(exerciseExecution: ExerciseExecution) {
    this.exerciseExecutionsService.deleteExercise(exerciseExecution);
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxExerciseExecutionComponent, {
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
