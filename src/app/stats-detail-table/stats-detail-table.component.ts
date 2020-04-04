import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatSort, MatPaginator} from "@angular/material";

import {ExerciseExecutionsService} from "../services/exercise-executions.service";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";
import {DialogBoxExerciseExecutionComponent} from "../dialog-box-exercise-execution/dialog-box-exercise-execution.component";
import {Sort} from "@angular/material/sort";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-detail-table.component.html',
  styleUrls: ['./stats-detail-table.component.css']
})
export class StatsDetailTableComponent implements OnInit,AfterViewInit {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  displayedColumns: {key,name}[];
  columnsToDisplay: string[] = [];
  data: MatTableDataSource<ExerciseExecution>;
  splicedData: any;
  offset = 0;
  pageSize = 5;
  pageSizeOptions = [3,5,10];


  constructor(public dialog: MatDialog,
              private exerciseExecutionService: ExerciseExecutionsService) { }

  ngOnInit() {
    this.data = new MatTableDataSource<ExerciseExecution>();
    this.displayedColumns = [{key:'set', name:'Set'}
      ,{key:'userId', name:'Name'}
      ,{key:'reps', name:'Reps'}
      //,{key:'duration', name:'Duration'}
      ,{key:'creationDate', name:'Date'}
      //,{key:'Edit', name:'Edit'}
      ];
    this.displayedColumns.slice().forEach( pair => this.columnsToDisplay.push(pair.name));

    this.exerciseExecutionService.getExerciseExecutions().subscribe(data => {
      this.data = new MatTableDataSource(data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as ExerciseExecution;
      }));
      this.data.data.sort((a,b)=> (a.creationDate.seconds < b.creationDate.seconds) ? 1:-1)
      this.splicedData = this.data.data.slice(this.offset).slice(0, this.pageSize);
    });
    this.pageSizeOptions = [5, 10, 15, 20, 25, this.data.data.length]
  }

  ngAfterViewInit(): void {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
    this.pageSizeOptions = [5, 10, 15, 20, 25, this.data.data.length]
  }
  pageChangeEvent(event: PageEvent) {
    const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.splicedData = this.data.data.slice(offset).slice(0, event.pageSize);
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
        case 'Set': return compare(a.set, b.set, isAsc);
        case 'Name': return compare(a.userId, b.userId, isAsc);
        case 'Reps': return compare(a.reps, b.reps, isAsc);
        case 'Date': return compare(a.creationDate.seconds, b.creationDate.seconds, isAsc);
        default: return 0;
      }
    });
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxExerciseExecutionComponent, {
      width: '450px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj){
    this.exerciseExecutionService.createExercise(row_obj);
  }

  updateRowData(row_obj){
    this.exerciseExecutionService.updateExercise(row_obj);
  }

  deleteRowData(row_obj){
    this.exerciseExecutionService.deleteExercise(row_obj);
  }

  addColumn() {
    const randomColumn = Math.floor(Math.random() * this.displayedColumns.length);
    this.columnsToDisplay.push(this.displayedColumns[randomColumn].name);
  }

  removeColumn() {
    if (this.columnsToDisplay.length) {
      this.columnsToDisplay.pop();
    }
  }

  shuffle() {
    let currentIndex = this.columnsToDisplay.length;
    while (0 !== currentIndex) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap
      let temp = this.columnsToDisplay[currentIndex];
      this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
      this.columnsToDisplay[randomIndex] = temp;
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

