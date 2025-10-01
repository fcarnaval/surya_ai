import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TongueCapturePage } from './tongue-capture.page';

describe('TongueCapturePage', () => {
  let component: TongueCapturePage;
  let fixture: ComponentFixture<TongueCapturePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TongueCapturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
