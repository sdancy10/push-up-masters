import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ExerciseExecution} from '../interfaces/ExerciseExecution';

interface PersonalRecord {
  userId: string;
  bestSingleSet: number;
  bestSingleSetDate: string;
  bestDailyTotal: number;
  bestDailyTotalDate: string;
  mostSetsInDay: number;
  mostSetsInDayDate: string;
  currentStreak: number;
  longestStreak: number;
  totalSets: number;
  totalReps: number;
}

@Component({
  selector: 'app-stats-personal-records',
  templateUrl: './stats-personal-records.component.html',
  styleUrls: ['./stats-personal-records.component.scss']
})
export class StatsPersonalRecordsComponent implements OnInit, OnChanges {
  @Input() data: ExerciseExecution[] = [];

  records: PersonalRecord[] = [];

  constructor() {}

  ngOnInit() {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.processData();
    }
  }

  private processData(): void {
    if (!this.data || this.data.length === 0) {
      this.records = [];
      return;
    }

    // Group by user
    const userMap: { [userId: string]: ExerciseExecution[] } = {};
    this.data.forEach(d => {
      if (!userMap[d.userId]) {
        userMap[d.userId] = [];
      }
      userMap[d.userId].push(d);
    });

    this.records = Object.keys(userMap).sort().map(userId => {
      const executions = userMap[userId];
      return this.computeRecords(userId, executions);
    });

    // Sort by total reps descending
    this.records.sort((a, b) => b.totalReps - a.totalReps);
  }

  private computeRecords(userId: string, executions: ExerciseExecution[]): PersonalRecord {
    // Best single set
    let bestSingleSet = 0;
    let bestSingleSetDate = '';
    executions.forEach(e => {
      if (e.reps > bestSingleSet) {
        bestSingleSet = e.reps;
        bestSingleSetDate = this.formatDate(e.creationDate.seconds);
      }
    });

    // Group by day using local timezone (matches getAggregateData's toLocaleDateString)
    const dailyMap: { [date: string]: { reps: number, sets: number, sortKey: string } } = {};
    executions.forEach(e => {
      const dateObj = new Date(e.creationDate.seconds * 1000);
      const localDateStr = dateObj.toLocaleDateString();
      // Sort key from local date components (YYYY-MM-DD) to avoid UTC shift
      const sortKey = dateObj.getFullYear() + '-' +
        String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
        String(dateObj.getDate()).padStart(2, '0');
      if (!dailyMap[sortKey]) {
        dailyMap[sortKey] = {reps: 0, sets: 0, sortKey: sortKey};
      }
      dailyMap[sortKey].reps += e.reps;
      dailyMap[sortKey].sets += 1;
      dailyMap[sortKey]['label'] = localDateStr;
    });

    // Best daily total
    let bestDailyTotal = 0;
    let bestDailyTotalDate = '';
    let mostSetsInDay = 0;
    let mostSetsInDayDate = '';

    Object.keys(dailyMap).forEach(key => {
      const day = dailyMap[key];
      if (day.reps > bestDailyTotal) {
        bestDailyTotal = day.reps;
        bestDailyTotalDate = dailyMap[key]['label'];
      }
      if (day.sets > mostSetsInDay) {
        mostSetsInDay = day.sets;
        mostSetsInDayDate = dailyMap[key]['label'];
      }
    });

    // Streak calculation
    const sortedDays = Object.keys(dailyMap).sort();
    const {currentStreak, longestStreak} = this.computeStreaks(sortedDays);

    // Totals
    const totalSets = executions.length;
    const totalReps = executions.reduce((sum, e) => sum + e.reps, 0);

    return {
      userId,
      bestSingleSet,
      bestSingleSetDate,
      bestDailyTotal,
      bestDailyTotalDate,
      mostSetsInDay,
      mostSetsInDayDate,
      currentStreak,
      longestStreak,
      totalSets,
      totalReps
    };
  }

  private computeStreaks(sortedDays: string[]): { currentStreak: number, longestStreak: number } {
    if (sortedDays.length === 0) {
      return {currentStreak: 0, longestStreak: 0};
    }

    let longestStreak = 1;
    let currentRun = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i - 1]);
      const curr = new Date(sortedDays[i]);
      const diffMs = curr.getTime() - prev.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentRun++;
      } else {
        currentRun = 1;
      }
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    }

    // Current streak: check if the last day is today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDay = new Date(sortedDays[sortedDays.length - 1]);
    lastDay.setHours(0, 0, 0, 0);
    const daysSinceLast = Math.round((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

    let currentStreak = 0;
    if (daysSinceLast <= 1) {
      // Count backwards from the end
      currentStreak = 1;
      for (let i = sortedDays.length - 1; i > 0; i--) {
        const prev = new Date(sortedDays[i - 1]);
        const curr = new Date(sortedDays[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return {currentStreak, longestStreak};
  }

  private formatDate(seconds: number): string {
    const d = new Date(seconds * 1000);
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
  }
}
