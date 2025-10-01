import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
})
export class GoalsPage implements OnInit {
    @Input() initialData: any = {};
    @Input() processing: boolean = false;
    @Output() dataChanged = new EventEmitter<any>();
    @Output() stepCompleted = new EventEmitter<any>();
    @Output() prevStepClicked = new EventEmitter<void>();

    goalsForm: FormGroup;
    modelName = 'Goals';
    initialFormValue: any = {};
    version: string = '';

    constructor(private fb: FormBuilder, private navCtrl: NavController,
                private profileService: ProfileFlowService,
                private configService: SuryaLibConfigService
    ) {
        this.goalsForm = this.fb.group({
            health_goals: [''],
        });

        // Get version from the consuming app's configuration
        const config = this.configService.getConfig();
        this.version = config?.version || '';
    }

    ngOnInit(): void {

      this.profileService.getProfileData(this.modelName)
      .then(data => {
          console.log('Dados do usuário:', data);
          this.goalsForm.patchValue(data);
          this.initialFormValue = { ...this.goalsForm.value };
      })
      .catch(error => {
          console.error('Erro ao buscar dados:', error);
      });
      
    }

    prevStep() {
      this.navCtrl.navigateBack('/medical-history');
    }
    
    nextStep() {
      if (this.hasFormChanged()) {

        this.profileService.saveStepData(this.modelName, this.goalsForm.value).then(() => {
            this.navCtrl.navigateForward('/tongue-capture');
        });

      } else {
          this.navCtrl.navigateForward('/tongue-capture');
      }
    }

    hasFormChanged(): boolean {
        return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.goalsForm.value);
    }

}
