import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';


@Component({
  selector: 'app-physical-attributes',
  templateUrl: './physical-attributes.page.html',
  styleUrls: ['./physical-attributes.page.scss'],
})
export class PhysicalAttributesPage implements OnInit {
    @Input() initialData: any = {};
    @Input() processing: boolean = false;
    @Output() dataChanged = new EventEmitter<any>();
    @Output() stepCompleted = new EventEmitter<any>();
    @Output() prevStepClicked = new EventEmitter<void>();
    
    physicalAttributesForm: FormGroup;
    initialFormValue: any = {};
    modelName = 'PhysicalAttributes';
    version: string = '';

  physicalAttributes = {
    body_constitution: [],
    skin_appearance: [],
    body_temperature: [],
    appetite: []
  };

  constructor(private fb: FormBuilder, private navCtrl: NavController, private profileService: ProfileFlowService, private configService: SuryaLibConfigService) {
    this.physicalAttributesForm = this.fb.group({
        body_constitution: [[]],
        skin_appearance: [[]],
        body_temperature: [[]],
        appetite: [[]]
    });
    
    // Get version from the consuming app's configuration
    const config = this.configService.getConfig();
    this.version = config?.version || '';
  }

  ngOnInit(): void {

    this.profileService.getProfileData(this.modelName)
    .then(data => {
        console.log('Dados do usuário:', data);
        this.physicalAttributesForm.patchValue(data);
        this.initialFormValue = { ...this.physicalAttributesForm.value };
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
    
  }

  prevStep() {
    this.navCtrl.navigateBack('/personal-data');
  }

  nextStep() {
    if (this.hasFormChanged()) {

        this.profileService.saveStepData(this.modelName, this.physicalAttributesForm.value).then(() => {
            this.navCtrl.navigateForward('/mind-setting');
        });

    } else {
        this.navCtrl.navigateForward('/mind-setting');
    }
  }

  hasFormChanged(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.physicalAttributesForm.value);
  }

}
