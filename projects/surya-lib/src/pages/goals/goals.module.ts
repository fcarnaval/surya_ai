import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoalsPageRoutingModule } from './goals-routing.module';

import { GoalsPage } from './goals.page';
import { HeaderModule } from '../../components/header/header.module';
import { ProfileFlowFooterModule } from '../../components/profile-flow-footer/profile-flow-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoalsPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
    ProfileFlowFooterModule
  ],
  declarations: [GoalsPage]
})
export class GoalsPageModule {}
