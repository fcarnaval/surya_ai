import { NgModule } from '@angular/core';
import { SuryaLibComponent } from './surya-lib.component';
import { LoginPageModule } from '../auth/pages/login/login.module';



@NgModule({
  declarations: [
    SuryaLibComponent
  ],
  imports: [
  ],
  exports: [
    SuryaLibComponent,
    LoginPageModule,
  ]
})
export class SuryaLibModule { }
