import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SuryaLibModule } from 'surya-lib';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HeaderInterceptor } from '../../../surya-lib/src/auth/interceptors/header.service';
import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SuryaLibConfigService } from '../../../surya-lib/src/lib/surya-lib-config.service';
import { environment } from '../environments/environment';
import { SpinnerModule } from 'surya-lib/components/spinner/spinner.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    SuryaLibModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SpinnerModule
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
  bootstrap: [AppComponent]
})
export class AppModule { 
    constructor(configService: SuryaLibConfigService) {
        configService.setConfig(environment);
    }
}
