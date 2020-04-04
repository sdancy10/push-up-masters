import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { StatsDetailTableComponent } from './stats-detail-table/stats-detail-table.component';
import { DialogBoxExerciseComponent } from './dialog-box-exercise/dialog-box-exercise.component';
import {DialogBoxExerciseExecutionComponent} from "./dialog-box-exercise-execution/dialog-box-exercise-execution.component";
import {ExerciseDataService} from "./services/exercise-data.service";
import { StatsAggregateTableComponent } from './stats-aggregate-table/stats-aggregate-table.component';
import { StatsAggregateLinechartComponent } from './stats-aggregate-linechart/stats-aggregate-linechart.component';
import {AngularFireModule} from "@angular/fire";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFirestore,AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from '../environments/environment';
import { ExercisesComponent } from './exercises/exercises.component';
import { ExerciseExecutionsComponent } from './exercise-executions/exercise-executions.component';
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";




@NgModule({
  declarations: [
    AppComponent,
    DialogBoxExerciseComponent,
    DialogBoxExerciseExecutionComponent,
    StatsDetailTableComponent,
    StatsAggregateTableComponent,
    StatsAggregateLinechartComponent,
    ExercisesComponent,
    ExerciseExecutionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    MaterialModule,
    MatNativeDateModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  entryComponents: [DialogBoxExerciseComponent, DialogBoxExerciseExecutionComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }, ExerciseDataService, AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
