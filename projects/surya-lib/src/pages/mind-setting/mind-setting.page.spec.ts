import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MindSettingPage } from './mind-setting.page';

describe('MindSettingPage', () => {
  let component: MindSettingPage;
  let fixture: ComponentFixture<MindSettingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MindSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
