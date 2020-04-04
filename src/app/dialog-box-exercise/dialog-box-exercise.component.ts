import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Exercise} from "../interfaces/Exercise";

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box-exercise.component.html',
  styleUrls: ['./dialog-box-exercise.component.css']
})
export class DialogBoxExerciseComponent {
  action:string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxExerciseComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Exercise) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }


}
