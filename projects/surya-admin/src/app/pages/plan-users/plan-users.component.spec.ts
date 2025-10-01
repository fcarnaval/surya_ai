import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanUsersComponent } from './plan-users.component';

describe('PlanUsersComponent', () => {
  let component: PlanUsersComponent;
  let fixture: ComponentFixture<PlanUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
