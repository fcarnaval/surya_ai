import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NotificationService } from '../../services/notification.service';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Component({
  selector: 'app-tongue-capture',
  templateUrl: './tongue-capture.page.html',
  styleUrls: ['./tongue-capture.page.scss'],
})
export class TongueCapturePage implements OnInit {
    @Input() initialData: any = {};
    @Input() processing: boolean = false;
    @Output() dataChanged = new EventEmitter<any>();
    @Output() stepCompleted = new EventEmitter<any>();
    @Output() prevStepClicked = new EventEmitter<void>();
    @Output() showNotification = new EventEmitter<string>();

    tonguePic: string = "";
    tongueModified: boolean = false;
    modelName = 'TongueCapture';
    captureButtonLabel: string = 'capturar língua';
    hasChanged: boolean = false;
    resultAPI: string = '';
    version: string = '';
    
    constructor(private navCtrl: NavController,
                private profileService: ProfileFlowService,
                private notificationService: NotificationService,
                private configService: SuryaLibConfigService) {
        // Get version from the consuming app's configuration
        const config = this.configService.getConfig();
        this.version = config?.version || '';
    }

    ngOnInit(): void {

      this.profileService.getProfileData(this.modelName)
      .then(data => {
          console.log('Dados do usuário:', data);
          this.tonguePic = 'data:image/jpeg;base64,' + data.tongue_image
          this.captureButtonLabel = 'capturar novamente'
      })
      .catch(error => {
          console.error('Erro ao buscar dados:', error);
      });

    }

    prevStep() {
      this.navCtrl.navigateBack('/goals');
    }

    nextStep() {
      let event = {};

      if (this.tonguePic) {
          
          const base64Data = this.tonguePic.split(",")[1];
          
          event = { 
              "tongue_image": base64Data 
          };

      }

      if (this.hasChanged) {

          this.profileService.saveStepData(this.modelName, event).then(() => {
              this.notificationService.showConfirmation('Suas informações foram salvas com sucesso!');
              this.navCtrl.navigateForward('/home');
          }).catch(error => {
              console.error("Error saving step data:", error);
              this.resultAPI = " " + error['error']['errors'];
              // Optionally show an error message to the user
          });

      } else {
          console.log("Foto não atualizada, pulando API")
          this.notificationService.showConfirmation('Suas informações foram salvas com sucesso!');
          this.navCtrl.navigateForward('/home');
      }
    }

    onFileSelected(event: Event) {

        const file = (event.target as HTMLInputElement).files?.[0];

        if (file) {

            this.hasChanged = true;

            const reader = new FileReader();
            
            reader.onload = () => {
                this.tongueModified = true;
                this.tonguePic = reader.result as string;
            };

            reader.readAsDataURL(file);

        }

    }

}
