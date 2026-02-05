import {Component, OnDestroy, OnInit} from '@angular/core';
import {Exercise} from '../interfaces/Exercise';
import {ExerciseService} from '../services/exercise.service';
import {ExerciseExecutionsService} from '../services/exercise-executions.service';
import {ExerciseExecution} from '../interfaces/ExerciseExecution';
import {ExerciseFilter} from '../interfaces/ExerciseFilter';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-exercise-analytics-page',
  templateUrl: './exercise-analytics-page.component.html',
  styleUrls: ['./exercise-analytics-page.component.scss']
})
export class ExerciseAnalyticsPageComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  allData: ExerciseExecution[] = [];
  filteredData: ExerciseExecution[] = [];
  availableUsers: string[] = [];
  dataDateRange: { min: Date, max: Date } = null;
  displayedDateRange: { min: Date, max: Date } = null;
  currentFilter: ExerciseFilter = {
    exerciseId: '4xUF196dzjSTe5qvwqtM',
    userIds: [],
    startDate: null,
    endDate: null
  };

  private dataSub: Subscription;
  private exerciseSub: Subscription;

  constructor(
    private exerciseService: ExerciseService,
    private exerciseExecutionsService: ExerciseExecutionsService
  ) {}

  ngOnInit() {
    this.exerciseSub = this.exerciseService.getExercises().subscribe(data => {
      this.exercises = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Exercise;
      });
    });
    this.fetchData(this.currentFilter.exerciseId);
  }

  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    if (this.exerciseSub) {
      this.exerciseSub.unsubscribe();
    }
  }

  onFilterChange(filter: ExerciseFilter): void {
    const exerciseChanged = filter.exerciseId !== this.currentFilter.exerciseId;
    this.currentFilter = filter;
    if (exerciseChanged) {
      this.fetchData(filter.exerciseId);
    } else {
      this.applyFilters();
    }
  }

  private fetchData(exerciseId: string): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    this.dataSub = this.exerciseExecutionsService.getExerciseExecutions(exerciseId).subscribe(data => {
      this.allData = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as ExerciseExecution;
      });
      this.availableUsers = [...new Set(this.allData.map(d => d.userId))].sort();
      this.dataDateRange = this.computeDateRange(this.allData);
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    let result = this.allData;

    if (this.currentFilter.userIds && this.currentFilter.userIds.length > 0) {
      result = result.filter(d => this.currentFilter.userIds.includes(d.userId));
    }

    if (this.currentFilter.startDate) {
      const startSeconds = this.currentFilter.startDate.getTime() / 1000;
      result = result.filter(d => d.creationDate.seconds >= startSeconds);
    }

    if (this.currentFilter.endDate) {
      const endDate = new Date(this.currentFilter.endDate);
      endDate.setHours(23, 59, 59, 999);
      const endSeconds = endDate.getTime() / 1000;
      result = result.filter(d => d.creationDate.seconds <= endSeconds);
    }

    this.filteredData = result;
    this.displayedDateRange = this.computeDateRange(result);
  }

  private computeDateRange(data: ExerciseExecution[]): { min: Date, max: Date } | null {
    if (!data || data.length === 0) {
      return null;
    }
    let minSeconds = Infinity;
    let maxSeconds = -Infinity;
    data.forEach(d => {
      if (d.creationDate && d.creationDate.seconds < minSeconds) {
        minSeconds = d.creationDate.seconds;
      }
      if (d.creationDate && d.creationDate.seconds > maxSeconds) {
        maxSeconds = d.creationDate.seconds;
      }
    });
    return {
      min: new Date(minSeconds * 1000),
      max: new Date(maxSeconds * 1000)
    };
  }
}
