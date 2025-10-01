import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage {

  constructor(private navCtrl: NavController) { }

  login() {
    console.log("login");
    this.navCtrl.navigateRoot('/home');
  }

}
