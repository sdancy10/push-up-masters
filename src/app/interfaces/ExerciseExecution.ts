import {Exercise} from "./Exercise";
import {User} from "./User";
import {Time} from "@angular/common";
import {firestore} from 'firebase'


export interface ExerciseExecution {
  id: string;
  reps: number;
  set: number;
  duration: TimeRanges;
  userId: string;
  exerciseId: string;
  creationDate: firestore.Timestamp;
}
