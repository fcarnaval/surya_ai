import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Component({
  selector: 'app-excrements',
  templateUrl: './excrements.page.html',
  styleUrls: ['./excrements.page.scss'],
})
export class ExcrementsPage implements OnInit {
    @Input() initialData: any = {};
    @Input() processing: boolean = false;
    @Output() dataChanged = new EventEmitter<any>();
    @Output() stepCompleted = new EventEmitter<any>();
    @Output() prevStepClicked = new EventEmitter<void>();
    
    excrementsForm: FormGroup;
    modelName = 'Excrements';
    initialFormValue: any = {};
    version: string = '';

    constructor(private fb: FormBuilder, private navCtrl: NavController,
                private profileService: ProfileFlowService,
                private configService: SuryaLibConfigService
    ) {
        this.excrementsForm = this.fb.group({
        urine_quality: ['', Validators.required],
        urine_frequency: ['', Validators.required],
        urine_smell: ['', Validators.required],
        feces_consistency: ['', Validators.required],
        feces_frequency: ['', Validators.required],
        feces_color: ['', Validators.required],
        feces_smell: ['', Validators.required],
        sweat_quantity: ['', Validators.required],
        sweat_smell: ['', Validators.required],
        });

        // Get version from the consuming app's configuration
        const config = this.configService.getConfig();
        this.version = config?.version || '';
    }

    ngOnInit(): void {

      this.profileService.getProfileData(this.modelName)
      .then(data => {
          console.log('Dados do usuário:', data);
          this.excrementsForm.patchValue(data);
          this.initialFormValue = { ...this.excrementsForm.value };
      })
      .catch(error => {
          console.error('Erro ao buscar dados:', error);
      });
      
    }

    prevStep() {
      this.navCtrl.navigateBack('/habbits');
    }   

    nextStep() {
      if (this.hasFormChanged()) {

        this.profileService.saveStepData(this.modelName, this.excrementsForm.value).then(() => {
            this.navCtrl.navigateForward('/medical-history');
        });

      } else {
          this.navCtrl.navigateForward('/medical-history');
      }
    }

    hasFormChanged(): boolean {
        return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.excrementsForm.value);
    }

}
