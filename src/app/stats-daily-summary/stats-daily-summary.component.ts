import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {ExerciseExecution} from '../interfaces/ExerciseExecution';

@Component({
  selector: 'app-stats-daily-summary',
  templateUrl: './stats-daily-summary.component.html',
  styleUrls: ['./stats-daily-summary.component.scss']
})
export class StatsDailySummaryComponent implements OnInit, OnChanges {
  @Input() data: ExerciseExecution[] = [];
  @ViewChild(BaseChartDirective, {static: false}) chart: BaseChartDirective;

  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Total Reps'
        }
      }]
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    }
  };
  barChartColors: Color[] = [];

  private palette: string[] = [
    'rgba(66,133,244,0.7)',   // blue
    'rgba(219,68,55,0.7)',    // red
    'rgba(244,180,0,0.7)',    // yellow
    'rgba(15,157,88,0.7)',    // green
    'rgba(171,71,188,0.7)',   // purple
    'rgba(255,112,67,0.7)',   // orange
    'rgba(0,172,193,0.7)',    // teal
    'rgba(124,179,66,0.7)',   // light green
  ];

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
      this.barChartLabels = [];
      this.barChartData = [];
      return;
    }

    // Group data by date and user
    const dateUserMap: { [date: string]: { [userId: string]: number } } = {};
    const allUsers = new Set<string>();

    this.data.forEach(d => {
      const date = new Date(d.creationDate.seconds * 1000);
      const dateStr = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      // Use local date components for sort key to match getAggregateData's local timezone grouping
      const sortKey = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');

      if (!dateUserMap[sortKey]) {
        dateUserMap[sortKey] = {};
        dateUserMap[sortKey]['_label'] = dateStr as any;
      }
      allUsers.add(d.userId);

      if (!dateUserMap[sortKey][d.userId]) {
        dateUserMap[sortKey][d.userId] = 0;
      }
      dateUserMap[sortKey][d.userId] += d.reps;
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(dateUserMap).sort();
    const users = Array.from(allUsers).sort();

    // Build labels (display format)
    this.barChartLabels = sortedDates.map(k => dateUserMap[k]['_label'] as any);

    // Build datasets (one per user)
    this.barChartData = users.map((userId, i) => ({
      label: userId,
      data: sortedDates.map(date => dateUserMap[date][userId] || 0),
      stack: 'stack'
    }));

    // Assign colors
    this.barChartColors = users.map((_, i) => ({
      backgroundColor: this.palette[i % this.palette.length],
      borderColor: this.palette[i % this.palette.length].replace('0.7', '1'),
      borderWidth: 1,
    }));
  }
}
