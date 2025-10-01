import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TongueCapturePageRoutingModule } from './tongue-capture-routing.module';

import { TongueCapturePage } from './tongue-capture.page';
import { HeaderModule } from '../../components/header/header.module';
import { ProfileFlowFooterModule } from '../../components/profile-flow-footer/profile-flow-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TongueCapturePageRoutingModule,
    HeaderModule,
    ProfileFlowFooterModule
  ],
  declarations: [TongueCapturePage]
})
export class TongueCapturePageModule {}
