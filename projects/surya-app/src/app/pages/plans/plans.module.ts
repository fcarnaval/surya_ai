import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlansPageRoutingModule } from './plans-routing.module';

import { PlansPage } from './plans.page';
import { PlansModule as LibPlansModule } from 'surya-lib/components/plans/plans.module';
import { TabsComponentModule } from '../../components/tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlansPageRoutingModule,
    LibPlansModule,
    TabsComponentModule
  ],
  declarations: [PlansPage]
})
export class PlansPageModule {}
