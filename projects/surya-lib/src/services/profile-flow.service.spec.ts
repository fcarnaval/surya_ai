import { TestBed } from '@angular/core/testing';

import { ProfileFlowService } from './profile-flow.service';

describe('ProfileFlowService', () => {
  let service: ProfileFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
