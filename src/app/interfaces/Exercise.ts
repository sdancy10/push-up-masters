import {ExerciseExecution} from "./ExerciseExecution";
import {firestore} from "firebase";

export interface Exercise {
  id: string;
  exerciseName: string;
  exerciseType: string;
  exerciseSummary: string;
  creationDate: firestore.Timestamp;
  updateDate: firestore.Timestamp;
  selected?: boolean;
}
