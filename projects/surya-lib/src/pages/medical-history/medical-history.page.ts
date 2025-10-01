import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.page.html',
  styleUrls: ['./medical-history.page.scss'],
})
export class MedicalHistoryPage implements OnInit  {
    @Input() initialData: any = {};
    @Input() processing: boolean = false;
    @Output() dataChanged = new EventEmitter<any>();
    @Output() stepCompleted = new EventEmitter<any>();
    @Output() prevStepClicked = new EventEmitter<void>();

    medicalHistoryForm: FormGroup;
    modelName = 'MedicalHistory';
    initialFormValue: any = {};
    version: string = '';

    constructor(private fb: FormBuilder, private navCtrl: NavController,
                private profileService: ProfileFlowService,
                private configService: SuryaLibConfigService
    ) {
        this.medicalHistoryForm = this.fb.group({
            medical_history: [''],
            current_symptons: [''],
            medication: ['']
        });

        // Get version from the consuming app's configuration
        const config = this.configService.getConfig();
        this.version = config?.version || '';
    }

    ngOnInit(): void {

      this.profileService.getProfileData(this.modelName)
      .then(data => {
          console.log('Dados do usuário:', data);
          this.medicalHistoryForm.patchValue(data);
          this.initialFormValue = { ...this.medicalHistoryForm.value };
      })
      .catch(error => {
          console.error('Erro ao buscar dados:', error);
      });
      
    }

    prevStep() {
      this.navCtrl.navigateBack('/excrements');
      }
    
    nextStep() {
      if (this.hasFormChanged()) {

        this.profileService.saveStepData(this.modelName, this.medicalHistoryForm.value).then(() => {
            this.navCtrl.navigateForward('/goals');
        });

      } else {
          this.navCtrl.navigateForward('/goals');
      }
    }

    hasFormChanged(): boolean {
        return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.medicalHistoryForm.value);
    }

}
