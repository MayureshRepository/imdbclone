import { TestBed } from '@angular/core/testing';

import { GettvshowdataService } from './gettvshowdata.service';

describe('GettvshowdataService', () => {
  let service: GettvshowdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GettvshowdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
