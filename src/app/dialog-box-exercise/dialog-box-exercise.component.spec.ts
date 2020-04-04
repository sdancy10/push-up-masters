import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxExerciseComponent } from './dialog-box-exercise.component';

describe('DialogBoxComponent', () => {
  let component: DialogBoxExerciseComponent;
  let fixture: ComponentFixture<DialogBoxExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBoxExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoxExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
