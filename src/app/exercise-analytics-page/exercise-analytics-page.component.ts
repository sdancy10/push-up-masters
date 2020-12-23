import { Component, OnInit } from '@angular/core';
import {Exercise} from "../interfaces/Exercise";
import {ExerciseService} from "../services/exercise.service";

@Component({
  selector: 'app-exercise-analytics-page',
  templateUrl: './exercise-analytics-page.component.html',
  styleUrls: ['./exercise-analytics-page.component.scss']
})
export class ExerciseAnalyticsPageComponent implements OnInit {
  selectedExercise: {
    id: string
    exerciseName: string
  };
  exercises: Exercise[];
  changeTrigger = 1;
  constructor(private exerciseService: ExerciseService) { }

  ngOnInit() {
    this.selectedExercise = {
      id:'4xUF196dzjSTe5qvwqtM',
      exerciseName:'All'
    }
    this.getExercises()
  }
  public setSelectedExercise(selectedExercise: { id: string, exerciseName: string }): void{
    this.exercises.forEach(e => {
      if (e.id == selectedExercise.id) {
        e.selected = true;
        this.selectedExercise = e;
        this.changeTrigger += 1;
      }
      else e.selected = false
    });
  }
  private getExercises() {
    this.exerciseService.getExercises().subscribe(
      data => {
        this.exercises = data.map(
          e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
            } as Exercise;
          });
        this.exercises.forEach(e => {
          if (e.id == this.selectedExercise.id) {
            e.selected = true;
            this.selectedExercise = e;
            this.changeTrigger += 1;
          }
          else e.selected = false
        })
      }
    );
  }

}
