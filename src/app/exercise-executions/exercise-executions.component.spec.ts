import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseExecutionsComponent } from './exercise-executions.component';

describe('ExerciseExecutionsComponent', () => {
  let component: ExerciseExecutionsComponent;
  let fixture: ComponentFixture<ExerciseExecutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseExecutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseExecutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
