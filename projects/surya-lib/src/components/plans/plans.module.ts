import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PlansComponent } from './plans.component';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [PlansComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HeaderModule
  ],
  exports: [PlansComponent]
})
export class PlansModule { }