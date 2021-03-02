import { TestBed } from '@angular/core/testing';

import { SplineService } from './spline.service';

describe('SplineServiceService', () => {
  let service: SplineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
