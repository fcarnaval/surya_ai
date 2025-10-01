import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MealsModalComponent } from './meals-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [MealsModalComponent],
  exports: [MealsModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MealsModuleComponentModule {}
