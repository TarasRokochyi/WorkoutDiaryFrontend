import { TestBed } from '@angular/core/testing';

import { WorkoutTemplateService } from './workout-template.service';

describe('WorkoutTemplateService', () => {
  let service: WorkoutTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
