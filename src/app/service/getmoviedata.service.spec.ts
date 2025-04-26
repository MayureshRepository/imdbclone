import { TestBed } from '@angular/core/testing';

import { GetmoviedataService } from './getmoviedata.service';

describe('GetmoviedataService', () => {
  let service: GetmoviedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetmoviedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
