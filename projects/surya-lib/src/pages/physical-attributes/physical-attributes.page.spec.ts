import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhysicalAttributesPage } from './physical-attributes.page';

describe('PhysicalAttributesPage', () => {
  let component: PhysicalAttributesPage;
  let fixture: ComponentFixture<PhysicalAttributesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalAttributesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
