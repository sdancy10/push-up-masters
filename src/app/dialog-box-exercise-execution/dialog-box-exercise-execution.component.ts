import {Component, Inject, OnInit, Optional} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';

import {ExerciseExecution} from "../interfaces/ExerciseExecution";
import {Exercise} from "../interfaces/Exercise";
import {ExerciseService} from "../services/exercise.service";
import {ErrorStateMatcher} from "@angular/material/core";

/** Error when invalid control is dirty, touched, or submitted. */
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box-exercise-execution.component.html',
  styleUrls: ['./dialog-box-exercise-execution.component.css']
})
export class DialogBoxExerciseExecutionComponent implements OnInit {
  action:string;
  local_data: any;
  exercises: any;
  repRange: number[] = [1,2,3,4,5,6,7,8,9,
                        10,11,12,13,14,15,16,17,18,19,
                        20,21,22,23,24,25,26,27,28,29,
                        30,31,32,33,34,35,36,37,38,39,
                        40,41,42,43,44,45,46,47,48,49,
                        50,51,52,53,54,55,56,57,58,59,
                        60,61,62,63,64,65,66,67,68,69,
                        70,71,72,73,74,75,76,77,78,79,
                        80,81,82,83,84,85,86,87,88,89,
                        90,91,92,93,94,95,96,97,98,99]
  nameFormControl = new FormControl('',[Validators.required, Validators.maxLength(50),Validators.minLength(3)]);
  exerciseFormControl = new FormControl('',[Validators.required]);
  repsFormControl = new FormControl('',[Validators.required]);
  setFormControl = new FormControl('',[Validators.required]);
  durationFormControl = new FormControl('',[]);
  dateFormControl = new FormControl('',[Validators.required]);
  exerciseForm: FormGroup;
  matcher = new CustomErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogBoxExerciseExecutionComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA)
    public data: ExerciseExecution,
    public exerciseService: ExerciseService,
    private formBuilder: FormBuilder)
  {
    this.local_data = {... data};
    this.action = this.local_data.action;
  }

  ngOnInit() {
    this.exerciseService.getExercises().subscribe(data => {
      this.exercises = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Exercise;
      })
    });
    this.exerciseForm = this.formBuilder.group (
      {
        userId: this.nameFormControl,
        exerciseId: this.exerciseFormControl,
        duration: this.durationFormControl,
        reps: this.repsFormControl,
        set: this.setFormControl,
        creationDate: this.dateFormControl,
        action: this.local_data.action
      }
    );
  }

  get f() { return this.exerciseForm.controls; }

  doAction(){
    if (this.exerciseForm.invalid) {
      return;
    }
    this.dialogRef.close({event:this.action, data:this.exerciseForm.value});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
}
