import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
    @Input() initialData: any = {};
    @Input() processing: boolean = false;
    @Output() dataChanged = new EventEmitter<any>();
    @Output() stepCompleted = new EventEmitter<any>();
    @Output() prevStepClicked = new EventEmitter<void>();
    
    personalDataForm: FormGroup;
    modelName = 'PersonalData'
    initialFormValue: any = {};
    version: string = '';

    personalData = {
        birthdate: '',
        gender: '',
        occupation: '',
        location: ''
    };

    constructor(private fb: FormBuilder, private navCtrl: NavController, private profileService: ProfileFlowService, private configService: SuryaLibConfigService) {
        this.personalDataForm = this.fb.group({
            birthdate: [''],
            gender: [''],
            occupation: [''],
            location: ['']
        });
        
        // Get version from the consuming app's configuration
        const config = this.configService.getConfig();
        this.version = config?.version || '';
    }

    ngOnInit(): void {

      this.profileService.getProfileData(this.modelName)
      .then(data => {
          console.log('Dados do usuário:', data);
          this.personalDataForm.patchValue(data);
          this.initialFormValue = { ...this.personalDataForm.value };
      })
      .catch(error => {
          console.error('Erro ao buscar dados:', error);
      });
      
    }

    prevStep() {
      this.navCtrl.navigateBack('/home');
    }

    nextStep() {
      if (this.hasFormChanged()) {

        this.profileService.saveStepData(this.modelName, this.personalDataForm.value).then(() => {
            this.navCtrl.navigateForward('/physical-attributes');
        });

    } else {
        this.navCtrl.navigateForward('/physical-attributes');
    }
    }

    hasFormChanged(): boolean {
        return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.personalDataForm.value);
    }

}
