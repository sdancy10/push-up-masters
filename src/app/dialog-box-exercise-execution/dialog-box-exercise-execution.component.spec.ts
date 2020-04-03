import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxExerciseExecutionComponent } from './dialog-box-exercise-execution.component';

describe('DialogBoxComponent', () => {
  let component: DialogBoxExerciseExecutionComponent;
  let fixture: ComponentFixture<DialogBoxExerciseExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBoxExerciseExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoxExerciseExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
