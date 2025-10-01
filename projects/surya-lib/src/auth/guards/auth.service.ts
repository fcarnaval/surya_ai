import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private navCtrl: NavController) {}

  canActivate(): boolean {
    console.log("canActivate");
    return this.checkAuthentication();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAuthentication();
  }

  private checkAuthentication(requiredGroups?: string[]): boolean {
    const idToken = localStorage.getItem('idToken');

    if (!idToken) {
      console.log("Login1");
      this.navCtrl.navigateRoot('/login');
      return false;
    }

    const tokenPayload = this.decodeToken(idToken);

    if (!tokenPayload) {
      console.log("Login2");
      this.navCtrl.navigateRoot('/login');
      return false;
    }

    const expirationTime = tokenPayload.exp * 1000;
    const currentTime = Date.now();

    if (currentTime > expirationTime) {
      localStorage.clear();
      console.log("Login3");
      this.navCtrl.navigateRoot('/login');
      return false;
    }

    // Check group membership if required
    if (requiredGroups && requiredGroups.length > 0) {
      const userGroups = this.getUserGroups(tokenPayload);
      const hasRequiredGroup = requiredGroups.some(group => userGroups.includes(group));
      
      if (!hasRequiredGroup) {
        console.log("Access denied - user not in required groups:", requiredGroups);
        this.navCtrl.navigateRoot('/login');
        return false;
      }
    }

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
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }
}
