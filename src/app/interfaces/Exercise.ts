import {ExerciseExecution} from "./ExerciseExecution";

export interface Exercise {
  id: string;
  exerciseName: string;
  exerciseType: string;
  exerciseSummary: string;
  creationDate: {seconds,nanoseconds};
  exerciseExecutions: ExerciseExecution[];
}
