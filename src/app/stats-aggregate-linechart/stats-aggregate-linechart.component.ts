import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import {ExerciseExecutionsService} from "../services/exercise-executions.service";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";

@Component({
  selector: 'app-stats-aggregate-linechart',
  templateUrl: './stats-aggregate-linechart.component.html',
  styleUrls: ['./stats-aggregate-linechart.component.scss']
})
export class StatsAggregateLinechartComponent implements OnInit, OnChanges {
  public lineChartData: ChartDataSets[] = [{ data: [] }];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }

  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];
  public exerciseData: ExerciseExecution[];
  @Input()
  changeTrigger: number;
  @Input()
  selectedExercise: {
    id: string,
    exerciseName: string
  }
  public lineChartMaxLen = 0;
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private exerciseService: ExerciseExecutionsService) {}

  ngOnInit() {

    this.exerciseService.getExerciseExecutions(this.selectedExercise.id).subscribe(data => {
      this.exerciseData = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as ExerciseExecution;
      });

      let aggData = this.exerciseService.getAggregateData(this.exerciseData, ['userId', 'creationDate']);
      let lineData = this.exerciseService.getAggregateLineData(aggData, ['userId']);
      this.lineChartData = lineData;
      this.lineChartLabels = [];
      let tmpUsers: { userId: string; createDate: string }[] = [];
      this.exerciseData.forEach( u => {
        let dateExists = false
        tmpUsers.forEach( tu => {
          if (tu.userId == u.userId && tu.createDate == String(u.creationDate)) {
            dateExists = true
          }
        })
        if (!dateExists) {
          tmpUsers.push({userId: u.userId, createDate: String(u.creationDate)})
        }
      });

      let userDates = this.groupBy(tmpUsers,['userId']);
      let maxUserDateLen = 0
      Object.keys(userDates).forEach( k => {
        if (userDates[k].length > maxUserDateLen) {
          maxUserDateLen = userDates[k].length
        }
      })
      for (let i = 1; i < maxUserDateLen+1; i++) {
        this.lineChartLabels.push('Day ' + (i).toString())
      }

    });
  }
  private groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = '';
      property.forEach(p => key += obj[p])
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  }

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    this.chart.update();
  }

  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public hideOne() {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

  public pushOne() {
    this.lineChartData.forEach((x, i) => {
      const num = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
  }

  public changeColor() {
    this.lineChartColors[2].borderColor = 'green';
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel() {
    this.lineChartLabels[2] = ['1st Line', '2nd Line'];
    // this.chart.update();
  }
}
