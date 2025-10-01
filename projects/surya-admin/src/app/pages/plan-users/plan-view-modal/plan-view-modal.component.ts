import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-plan-view-modal',
  templateUrl: './plan-view-modal.component.html',
  styleUrls: ['./plan-view-modal.component.scss']
})
export class PlanViewModalComponent {
  @Input() userId!: string;
  @Input() userName!: string;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}