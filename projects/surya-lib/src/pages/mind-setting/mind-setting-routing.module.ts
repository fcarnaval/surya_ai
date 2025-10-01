import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MindSettingPage } from './mind-setting.page';

const routes: Routes = [
  {
    path: '',
    component: MindSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MindSettingPageRoutingModule {}
