import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhysicalAttributesPageRoutingModule } from './physical-attributes-routing.module';
import { PhysicalAttributesPage } from './physical-attributes.page';
import { HeaderModule } from '../../components/header/header.module';
import { ProfileFlowFooterModule } from '../../components/profile-flow-footer/profile-flow-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhysicalAttributesPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
    ProfileFlowFooterModule
  ],
  declarations: [PhysicalAttributesPage]
})
export class PhysicalAttributesPageModule {}
