import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material';
import {ExerciseExecutionsService} from "../services/exercise-executions.service";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ExerciseService} from "../services/exercise.service";
import {Exercise} from "../interfaces/Exercise";

@Component({
  selector: 'app-stats-aggregate-table',
  templateUrl: './stats-aggregate-table.component.html',
  styleUrls: ['./stats-aggregate-table.component.css']
})
export class StatsAggregateTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  displayedColumns: {key,name}[] =
    [
      {key:'sets', name:'Sets'},
      {key:'userId', name:'Name'},
      {key:'reps', name:'Reps'},
      //{key:'controls', name:'Controls'}
    ];
  columnsToDisplay: string[] = [];
  groupByUserData: MatTableDataSource<ExerciseExecution> = new MatTableDataSource<ExerciseExecution>();
  data: MatTableDataSource<ExerciseExecution> = new MatTableDataSource<ExerciseExecution>();
  splicedData: any;
  offset = 0;
  pageSize = 5;
  pageSizeOptions = [3,5,10];
  leaderBoardTypes: {name: string, selected: boolean}[] =
    [
      {name:'All-Time', selected:true},
      {name:'User', selected:false},
      {name:'Date', selected:false}];
  exercises: Exercise[];
  @Input()
  changeTrigger: number;
  @Input()
  selectedExercise: {
    id: string,
    name: string
  }
  uatTesting: any;

  constructor(public dialog: MatDialog,
              private exerciseExecutionsService: ExerciseExecutionsService) {
    this.displayedColumns.slice().forEach(pair => this.columnsToDisplay.push(pair.name));
  }

  ngOnInit() {
    this.getExerciseExecutionData(this.selectedExercise.id)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getExerciseExecutionData(this.selectedExercise.id)
  }

  getExerciseExecutionData(exerciseId: string) {
    this.exerciseExecutionsService.getExerciseExecutions(exerciseId).subscribe(data => {
      this.data = new MatTableDataSource<ExerciseExecution>(data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as ExerciseExecution;
      }));
      this.groupByUserData = new MatTableDataSource<ExerciseExecution>(
        this.exerciseExecutionsService.getAggregateData(this.data.data,['userId'])
      );
      this.groupByUserData.data.sort((a,b)=> (a.reps < b.reps) ? 1:-1)
      this.splicedData = this.groupByUserData.data.slice(this.offset).slice(0, this.pageSize);
    });
  }

  ngAfterViewInit(): void {
    this.groupByUserData.sort = this.sort;
    this.groupByUserData.paginator = this.paginator;
  }

  setAggregation(selectedAggregation: string): void{
    this.leaderBoardTypes.forEach(agg => {
      agg.name == selectedAggregation ? agg.selected = true : agg.selected = false;
    });
  }



  pageChangeEvent(event: PageEvent) {
    const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.splicedData = this.groupByUserData.data.slice(offset).slice(0, event.pageSize);
  }

  sortData(sort: Sort) {
    const data = this.splicedData.slice();
    if (!sort.active || sort.direction === '') {
      this.splicedData = data;
      return;
    }

    this.splicedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Sets': return compare(a.set, b.set, isAsc);
        case 'Name': return compare(a.userId, b.userId, isAsc);
        case 'Reps': return compare(a.reps, b.reps, isAsc);
        default: return 0;
      }
    });
  }

  test() {
    // this.exerciseExecutionsService
    //   .getExerciseExecutionsByUser('Shane', 'D3ZYs2LBx10eDegpQxzo').subscribe(
    //   data => this.uatTesting = new MatTableDataSource<ExerciseExecution>(
    //     data.map(e => {
    //       return {
    //         id: e.payload.doc.id,
    //         ...e.payload.doc.data()
    //       } as ExerciseExecution;
    //     }))
    // );
    // console.warn(
    //   this.uatTesting
    // )
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
