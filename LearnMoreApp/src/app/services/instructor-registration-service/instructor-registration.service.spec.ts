import { TestBed } from '@angular/core/testing';

import { InstructorRegistrationService } from './instructor-registration.service';

describe('InstructorRegistrationService', () => {
  let service: InstructorRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});




