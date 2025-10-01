import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhysicalAttributesPage } from './physical-attributes.page';

const routes: Routes = [
  {
    path: '',
    component: PhysicalAttributesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhysicalAttributesPageRoutingModule {}
