import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanLoad {

  constructor(private navCtrl: NavController) {}

  canActivate(): boolean {
    console.log("AdminAuthGuard - canActivate");
    return this.checkAdminAuthentication();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAdminAuthentication();
  }

  private checkAdminAuthentication(): boolean {
    const idToken = localStorage.getItem('idToken');

    if (!idToken) {
      console.log("Admin access denied - no token");
      this.navCtrl.navigateRoot('/login');
      return false;
    }

    const tokenPayload = this.decodeToken(idToken);

    if (!tokenPayload) {
      console.log("Admin access denied - invalid token");
      this.navCtrl.navigateRoot('/login');
      return false;
    }

    const expirationTime = tokenPayload.exp * 1000;
    const currentTime = Date.now();

    if (currentTime > expirationTime) {
      localStorage.clear();
      console.log("Admin access denied - token expired");
      this.navCtrl.navigateRoot('/login');
      return false;
    }

    // Check if user is in admin group
    const userGroups = this.getUserGroups(tokenPayload);
    const isAdmin = userGroups.includes('admin');
    
    if (!isAdmin) {
      console.log("Admin access denied - user not in admin group. User groups:", userGroups);
      this.navCtrl.navigateRoot('/access-denied');
      return false;
    }

    console.log("Admin access granted. User groups:", userGroups);
    return true;
  }

  private getUserGroups(tokenPayload: any): string[] {
    return tokenPayload['cognito:groups'] || [];
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}