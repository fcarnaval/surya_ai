import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TongueCapturePage } from './tongue-capture.page';

const routes: Routes = [
  {
    path: '',
    component: TongueCapturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongueCapturePageRoutingModule {}
