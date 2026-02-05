import {firestore} from 'firebase'

export interface ExerciseExecution {
  id: string;
  reps: number;
  set: number;
  duration: number;
  userId: string;
  exerciseId: string;
  creationDate: firestore.Timestamp;
}
