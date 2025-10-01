import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HabbitsPage } from './habbits.page';

const routes: Routes = [
  {
    path: '',
    component: HabbitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HabbitsPageRoutingModule {}
