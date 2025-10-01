import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TabsComponentModule } from '../components/tabs/tabs.module';
import { HeaderModule } from 'surya-lib/components/header/header.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TabsComponentModule,
    HeaderModule
],
  declarations: [HomePage]
})
export class HomePageModule {}
