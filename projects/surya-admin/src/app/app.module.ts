import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SuryaLibModule } from 'surya-lib';
import { HeaderModule } from 'surya-lib/components/header/header.module';
import { PlansModule } from 'surya-lib/components/plans/plans.module';
import { HomeComponent } from './pages/home/home.component';
import { SuryaLibConfigService } from 'surya-lib/lib/surya-lib-config.service';
import { environment } from '../environments/environment';
import { RouteReuseStrategy } from '@angular/router';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { UsersComponent } from './pages/users/users.component';
import { ProfileInfoComponent } from './pages/profile-info/profile-info.component';
import { CookieService } from 'ngx-cookie-service';
import { HeaderInterceptor } from 'surya-lib/auth/interceptors/header.service';
import { CreateUserModalComponent } from './pages/users/create-user-modal/create-user-modal.component';
import { PlanUsersComponent } from './pages/plan-users/plan-users.component';
import { PlanViewModalComponent } from './pages/plan-users/plan-view-modal/plan-view-modal.component';
import { ViewCompletePlanComponent } from './pages/view-complete-plan/view-complete-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccessDeniedComponent,
    UsersComponent,
    ProfileInfoComponent,
    CreateUserModalComponent,
    PlanUsersComponent,
    PlanViewModalComponent,
    ViewCompletePlanComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    IonicModule.forRoot({
      innerHTMLTemplatesEnabled: true,
      sanitizerEnabled: true
    }),
    SuryaLibModule,
    HeaderModule,
    PlansModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideHttpClient(withInterceptorsFromDi()),
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor, 
      multi : true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { 
  constructor(configService: SuryaLibConfigService) {
    configService.setConfig(environment);
  }
}
