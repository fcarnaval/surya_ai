import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Component({
  selector: 'app-mind-setting',
  templateUrl: './mind-setting.page.html',
  styleUrls: ['./mind-setting.page.scss'],
})
export class MindSettingPage implements OnInit {
    @Input() initialData: any = {};
    @Input() processing: boolean = false;
    @Output() dataChanged = new EventEmitter<any>();
    @Output() stepCompleted = new EventEmitter<any>();
    @Output() prevStepClicked = new EventEmitter<void>();
    
    mindSettingForm: FormGroup;
    modelName = 'MindSetting';
    initialFormValue: any = {};
    version: string = '';

  mindSetting = {
    emotional: [],
    temper: [],
    life_style: []
  };

  constructor(private fb: FormBuilder, private navCtrl: NavController, private profileService: ProfileFlowService, private configService: SuryaLibConfigService) {
    this.mindSettingForm = this.fb.group({
        emotional: [[]],
        temper: [[]],
        life_style: [[]]
    });
    
    // Get version from the consuming app's configuration
    const config = this.configService.getConfig();
    this.version = config?.version || '';
  }

  ngOnInit(): void {

    this.profileService.getProfileData(this.modelName)
    .then(data => {
        console.log('Dados do usuário:', data);
        this.mindSettingForm.patchValue(data);
        this.initialFormValue = { ...this.mindSettingForm.value };
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
    
  }

  prevStep() {
    this.navCtrl.navigateBack('/physical-attributes');
  }

  nextStep() {
    if (this.hasFormChanged()) {

        this.profileService.saveStepData(this.modelName, this.mindSettingForm.value).then(() => {
            this.navCtrl.navigateForward('/habbits');
        });

    } else {
        this.navCtrl.navigateForward('/habbits');
    }
  }

  hasFormChanged(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.mindSettingForm.value);
  }

}
