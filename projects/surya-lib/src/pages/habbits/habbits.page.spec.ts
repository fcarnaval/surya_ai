import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabbitsPage } from './habbits.page';

describe('HabbitsPage', () => {
  let component: HabbitsPage;
  let fixture: ComponentFixture<HabbitsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HabbitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
