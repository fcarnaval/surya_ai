import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {
  version = '0.2';

  constructor(private navCtrl: NavController) {}

  goToApp() {
    // Redirect to the main Surya app
    window.location.href = 'http://localhost:4200';
  }

  logout() {
    // Clear authentication tokens and redirect to login
    localStorage.clear();
    this.navCtrl.navigateRoot('/login');
  }
}
