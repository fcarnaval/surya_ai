import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { PlanService } from '../services/plan.service';
import { NotificationService } from '../../../../surya-lib/src/services/notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { environment } from '../../environments/environment';
import { SpinnerService } from 'surya-lib/public-api';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateY(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class HomePage implements OnInit {

  first_name: string = '';
  question: string = '';
  confirmationMessage: string | null = null;
  version: string = environment.version;
  hasPlan: boolean = false;
  isGeneratingPlan: boolean = false;

  constructor(private userService: UserService,
    private chatService: ChatService,
    private navCtrl: NavController,
    private notificationService: NotificationService,
    private planService: PlanService,
    public spinner: SpinnerService
  ) {
    console.log("home constructor");
  }

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (response) => {
        this.first_name = response.first_name;
      },
      error: (err) => {
        console.error("Erro ao buscar info:", err);
      }
    });

    this.planService.getPlan().subscribe({
      next: (response) => {
        this.hasPlan = response.status === 'found';
        this.isGeneratingPlan = response.status === 'generating';
      },
      error: (err) => {
        console.error("Erro ao buscar plano:", err);
        this.hasPlan = false;
        this.isGeneratingPlan = false;
      }
    });

    this.notificationService.confirmation$.subscribe(message => {
      this.confirmationMessage = message;
      if (message) {
        setTimeout(() => {
          this.dismissConfirmation();
        }, 5000);
      }
    });
  }

  dismissConfirmation() {
    this.notificationService.clearConfirmation();
  }

  onSubmit() {
    this.chatService.submitQuestion(this.question, true);
  }

  navigateToQuestionnaire() {
    this.navCtrl.navigateForward('/personal-data');
  }

  navigateToPersonalData() {
    this.navCtrl.navigateForward('/personal-data');
  }

  navigateToPlans() {
    this.navCtrl.navigateForward('/plans');
  }

}
