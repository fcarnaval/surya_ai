import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {

    constructor(private navCtrl: NavController) { console.log("tabs")}

    navigateTo(path: string) {
      console.log('Navigating to:', path);
      
      // Try different navigation methods based on the path
      // if (path === '/home') {
      //   console.log('Already on home, skipping navigation');
      //   return;
      // }
      
      // Use navigateRoot for major page transitions
      this.navCtrl.navigateRoot(path).then(() => {
        console.log('Navigation successful to:', path);
      }).catch((error) => {
        console.error('Navigation failed:', error);
        // Fallback to window.location
        window.location.href = path;
      });
    }

}
