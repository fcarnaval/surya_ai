import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MindSettingPageRoutingModule } from './mind-setting-routing.module';
import { MindSettingPage } from './mind-setting.page';
import { HeaderModule } from '../../components/header/header.module';
import { ProfileFlowFooterModule } from '../../components/profile-flow-footer/profile-flow-footer.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MindSettingPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
    ProfileFlowFooterModule
  ],
  declarations: [MindSettingPage]
})
export class MindSettingPageModule {}
