import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseAnalyticsPageComponent } from './exercise-analytics-page.component';

describe('ExerciseAnalyticsPageComponent', () => {
  let component: ExerciseAnalyticsPageComponent;
  let fixture: ComponentFixture<ExerciseAnalyticsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseAnalyticsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseAnalyticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
