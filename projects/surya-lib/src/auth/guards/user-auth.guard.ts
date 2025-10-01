import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuard } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate, CanLoad {

  constructor(private authGuard: AuthGuard) {}

  canActivate(): boolean {
    return this.authGuard.canActivate();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authGuard.canLoad(route, segments);
  }
}