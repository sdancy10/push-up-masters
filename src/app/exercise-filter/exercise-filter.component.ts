import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Exercise} from '../interfaces/Exercise';
import {ExerciseFilter} from '../interfaces/ExerciseFilter';

@Component({
  selector: 'app-exercise-filter',
  templateUrl: './exercise-filter.component.html',
  styleUrls: ['./exercise-filter.component.scss']
})
export class ExerciseFilterComponent {
  @Input() exercises: Exercise[] = [];
  @Input() availableUsers: string[] = [];
  @Input() dataDateRange: { min: Date, max: Date } = null;
  @Input() displayedDateRange: { min: Date, max: Date } = null;
  @Input() resultCount = 0;
  @Output() filterChange = new EventEmitter<ExerciseFilter>();

  selectedExerciseId = '4xUF196dzjSTe5qvwqtM';
  selectedUserIds: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  onFilterChange(): void {
    this.filterChange.emit({
      exerciseId: this.selectedExerciseId,
      userIds: this.selectedUserIds,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  clearFilters(): void {
    this.selectedExerciseId = '4xUF196dzjSTe5qvwqtM';
    this.selectedUserIds = [];
    this.startDate = null;
    this.endDate = null;
    this.onFilterChange();
  }

  get hasActiveFilters(): boolean {
    return this.selectedUserIds.length > 0
      || this.startDate !== null
      || this.endDate !== null;
  }
}
