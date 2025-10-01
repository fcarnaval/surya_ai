import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFlowFooterComponent } from './profile-flow-footer.component';

describe('ProfileFlowFooterComponent', () => {
  let component: ProfileFlowFooterComponent;
  let fixture: ComponentFixture<ProfileFlowFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileFlowFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileFlowFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
