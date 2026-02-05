import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material';
import {ExerciseExecutionsService} from "../services/exercise-executions.service";
import {ExerciseExecution} from "../interfaces/ExerciseExecution";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-stats-aggregate-table',
  templateUrl: './stats-aggregate-table.component.html',
  styleUrls: ['./stats-aggregate-table.component.scss']
})
export class StatsAggregateTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  displayedColumns: {key,name}[] = [];
  columnsToDisplay: string[] = [];

  private columnConfigs = {
    'All-Time': [
      {key:'sets', name:'Sets'},
      {key:'userId', name:'Name'},
      {key:'reps', name:'Reps'},
    ],
    'User': [
      {key:'sets', name:'Sets'},
      {key:'userId', name:'Name'},
      {key:'reps', name:'Reps'},
      {key:'creationDate', name:'Date'},
    ],
    'Date': [
      {key:'sets', name:'Sets'},
      {key:'creationDate', name:'Date'},
      {key:'reps', name:'Reps'},
    ],
  };
  groupByUserData: MatTableDataSource<ExerciseExecution> = new MatTableDataSource<ExerciseExecution>();
  tableData: MatTableDataSource<ExerciseExecution> = new MatTableDataSource<ExerciseExecution>();
  splicedData: any;
  offset = 0;
  pageSize = 5;
  pageSizeOptions = [3,5,10];
  leaderBoardTypes: {name: string, selected: boolean}[] =
    [
      {name:'All-Time', selected:true},
      {name:'User', selected:false},
      {name:'Date', selected:false}];

  @Input()
  data: ExerciseExecution[] = [];

  constructor(public dialog: MatDialog,
              private exerciseExecutionsService: ExerciseExecutionsService) {
    this.updateColumns();
  }

  private updateColumns(): void {
    this.displayedColumns = this.columnConfigs[this.activeAggregation] || this.columnConfigs['All-Time'];
    this.columnsToDisplay = this.displayedColumns.map(c => c.name);
  }

  ngOnInit() {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.processData();
    }
  }

  private processData(): void {
    this.updateColumns();

    if (!this.data || this.data.length === 0) {
      this.groupByUserData = new MatTableDataSource<ExerciseExecution>();
      this.splicedData = [];
      return;
    }
    // Shallow copy to avoid mutating shared data (getAggregateData mutates creationDate)
    const dataCopy = this.data.map(d => ({...d}));
    this.tableData = new MatTableDataSource<ExerciseExecution>(dataCopy);

    let groupByKeys: string[];
    switch (this.activeAggregation) {
      case 'User':
        groupByKeys = ['userId', 'creationDate'];
        break;
      case 'Date':
        groupByKeys = ['creationDate'];
        break;
      default: // All-Time
        groupByKeys = ['userId'];
        break;
    }

    this.groupByUserData = new MatTableDataSource<ExerciseExecution>(
      this.exerciseExecutionsService.getAggregateData(this.tableData.data, groupByKeys)
    );
    this.groupByUserData.data.sort((a, b) => (a.reps < b.reps) ? 1 : -1);
    this.splicedData = this.groupByUserData.data.slice(this.offset).slice(0, this.pageSize);

    if (this.paginator) {
      this.paginator.firstPage();
      this.groupByUserData.paginator = this.paginator;
    }
    if (this.sort) {
      this.groupByUserData.sort = this.sort;
    }
  }

  ngAfterViewInit(): void {
    this.groupByUserData.sort = this.sort;
    this.groupByUserData.paginator = this.paginator;
  }

  setAggregation(selectedAggregation: string): void {
    this.leaderBoardTypes.forEach(agg => {
      agg.selected = agg.name === selectedAggregation;
    });
    this.processData();
  }

  private get activeAggregation(): string {
    const active = this.leaderBoardTypes.find(a => a.selected);
    return active ? active.name : 'All-Time';
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
        case 'Sets': return compare(a.sets, b.sets, isAsc);
        case 'Name': return compare(a.userId, b.userId, isAsc);
        case 'Reps': return compare(a.reps, b.reps, isAsc);
        case 'Date': return compare(a.creationDate, b.creationDate, isAsc);
        default: return 0;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
    this.splicedData = this.tableData.filteredData.slice(this.offset).slice(0, this.pageSize);

    if (this.tableData.paginator) {
      this.tableData.paginator.firstPage();
    }
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
