import { Component, OnInit } from '@angular/core';
import {Exercise} from "../interfaces/Exercise";
import {ExerciseService} from "../services/exercise.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  selectedExercise: {
    id: string
    name: string
  };
  exercises: Exercise[];
  changeTrigger = 1;
  constructor(private exerciseService: ExerciseService) {
  }

  ngOnInit() {
    this.selectedExercise = {
      id:'4xUF196dzjSTe5qvwqtM',
      name:'All'
    }
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
          e.selected = e.id == this.selectedExercise.id;
          if (e.selected) {
            this.selectedExercise.id = e.id;
          }
        })
      }
    )
  }
  setExercise(selectedExercise: string): void{
    this.exercises.forEach( exercise => {
      exercise.selected = exercise.id == selectedExercise;
      if (exercise.selected) {
        this.selectedExercise.id = exercise.id;
        this.selectedExercise.name = exercise.exerciseName;
        this.changeTrigger ++;
      }
    });
  }

}
