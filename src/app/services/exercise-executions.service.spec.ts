import { TestBed } from '@angular/core/testing';

import { ExerciseExecutionsService } from './exercise-executions.service';

describe('ExerciseExecutionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExerciseExecutionsService = TestBed.get(ExerciseExecutionsService);
    expect(service).toBeTruthy();
  });
});
