import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcrementsPage } from './excrements.page';

describe('ExcrementsPage', () => {
  let component: ExcrementsPage;
  let fixture: ComponentFixture<ExcrementsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcrementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
