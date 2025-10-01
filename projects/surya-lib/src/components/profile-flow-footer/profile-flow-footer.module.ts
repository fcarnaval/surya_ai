import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileFlowFooterComponent } from './profile-flow-footer.component';

@NgModule({
  declarations: [
    ProfileFlowFooterComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ProfileFlowFooterComponent
  ]
})
export class ProfileFlowFooterModule { }