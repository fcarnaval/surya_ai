import { TestBed } from '@angular/core/testing';

import { SuryaLibService } from './surya-lib.service';

describe('SuryaLibService', () => {
  let service: SuryaLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuryaLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
