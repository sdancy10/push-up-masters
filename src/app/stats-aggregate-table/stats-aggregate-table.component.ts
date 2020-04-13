import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import {PushUpElement} from "../interfaces/push-up-element";
import {ExerciseDataService} from "../services/exercise-data.service";
import {UserPushUpAggregateElement} from "../interfaces/user-push-up-aggregate-element";
import {ExerciseExecutionsService} from "../services/exercise-executions.service";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-stats-aggregate-table',
  templateUrl: './stats-aggregate-table.component.html',
  styleUrls: ['./stats-aggregate-table.component.css']
})
export class StatsAggregateTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  displayedColumns: {key,name}[];
  columnsToDisplay: string[] = [];
  groupByUserData: MatTableDataSource<ExerciseExecution>;
  data: MatTableDataSource<ExerciseExecution>;
  splicedData: any;
  offset = 0;
  pageSize = 5;
  pageSizeOptions = [3,5,10];
  uatTesting: boolean = false;

  constructor(public dialog: MatDialog,
              private exerciseExecutionsService: ExerciseExecutionsService) { }

  ngOnInit() {
    this.data = new MatTableDataSource<ExerciseExecution>();
    this.groupByUserData = new MatTableDataSource<ExerciseExecution>();

    this.displayedColumns = [{key:'sets', name:'Sets'},
      {key:'userId', name:'Name'},
      {key:'reps', name:'Reps'},
      //{key:'controls', name:'Controls'}
      ];
    this.displayedColumns.slice().forEach( pair => this.columnsToDisplay.push(pair.name));

    this.exerciseExecutionsService.getExerciseExecutions().subscribe(data => {
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
    console.warn(this.data)
    console.warn(this.groupByUserData)
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
