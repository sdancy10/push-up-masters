export interface ExerciseFilter {
  exerciseId: string;
  userIds: string[];
  startDate: Date | null;
  endDate: Date | null;
}
