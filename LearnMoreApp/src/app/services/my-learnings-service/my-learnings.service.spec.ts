import { TestBed } from '@angular/core/testing';

import { MyLearningsService } from './my-learnings.service';

describe('MyLearningsService', () => {
  let service: MyLearningsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyLearningsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});






