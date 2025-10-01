import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuryaLibComponent } from './surya-lib.component';

describe('SuryaLibComponent', () => {
  let component: SuryaLibComponent;
  let fixture: ComponentFixture<SuryaLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuryaLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuryaLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
