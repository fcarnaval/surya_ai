import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPasswordPageRoutingModule } from './new-password-routing.module';

import { NewPasswordPage } from './new-password.page';
import { LogoHeaderComponentModule } from '../../../../../surya-app/src/app/components/logo-header/logo-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPasswordPageRoutingModule,
    ReactiveFormsModule,
    LogoHeaderComponentModule
  ],
  declarations: [NewPasswordPage]
})
export class NewPasswordPageModule {}
