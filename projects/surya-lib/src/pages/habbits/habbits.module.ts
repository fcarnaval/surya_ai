import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HabbitsPageRoutingModule } from './habbits-routing.module';

import { HabbitsPage } from './habbits.page';
import { HeaderModule } from '../../components/header/header.module';
import { ProfileFlowFooterModule } from '../../components/profile-flow-footer/profile-flow-footer.module';
import { MealsModuleComponentModule } from 'surya-lib/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HabbitsPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
    ProfileFlowFooterModule,
    MealsModuleComponentModule
  ],
  declarations: [HabbitsPage]
})
export class HabbitsPageModule {}
