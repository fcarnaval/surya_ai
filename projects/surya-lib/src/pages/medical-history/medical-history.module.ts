import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalHistoryPageRoutingModule } from './medical-history-routing.module';

import { MedicalHistoryPage } from './medical-history.page';
import { HeaderModule } from '../../components/header/header.module';
import { ProfileFlowFooterModule } from '../../components/profile-flow-footer/profile-flow-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalHistoryPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
    ProfileFlowFooterModule
  ],
  declarations: [MedicalHistoryPage]
})
export class MedicalHistoryPageModule {}
