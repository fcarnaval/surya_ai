import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExcrementsPage } from './excrements.page';

const routes: Routes = [
  {
    path: '',
    component: ExcrementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExcrementsPageRoutingModule {}
