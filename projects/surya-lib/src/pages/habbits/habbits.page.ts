import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { MealsModalComponent } from '../../components/meals-modal/meals-modal.component';
import { MEAL_OPTIONS } from '../../options/meal-options';
import { Meal } from '../../interfaces/meal';
import { ProfileFlowService } from '../../services/profile-flow.service';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Component({
  selector: 'app-habbits',
  templateUrl: './habbits.page.html',
  styleUrls: ['./habbits.page.scss']
})
export class HabbitsPage implements OnInit {
  @ViewChild('mealModal') mealModal!: IonModal;
  @Input() initialData: any = {};
  @Input() processing: boolean = false;
  @Output() dataChanged = new EventEmitter<any>();
  @Output() stepCompleted = new EventEmitter<any>();
  @Output() prevStepClicked = new EventEmitter<void>();

  mealHasChanged: boolean = false;
  version: string = '';

  initialHabbitsFormValue: any = {};
  habbitsForm: FormGroup;
  mealForm: FormGroup;  
  activityForm: FormGroup;
  alcoholForm: FormGroup;
  smokeForm: FormGroup;
  initialActivityForm: any = {};
  initialAlcoholForm: any = {};
  initialSmokeForm: any = {};
  meals: any[] = [];
  editingMealIndex: number | null = null;
  mealOptions = MEAL_OPTIONS;

  constructor(private fb: FormBuilder, private modalCtrl: ModalController, 
              private alertCtrl: AlertController, private navCtrl: NavController,
              private profileService: ProfileFlowService, private configService: SuryaLibConfigService) {
    this.habbitsForm = this.fb.group({
      diet_description: ['', Validators.required],
      activity: [false],
      vitality: [''],
      sleep_quality: [''],
      sleep_time: [''],
      alcohol: [false],
      smoke: [false]
    });

    this.mealForm = this.fb.group({
      meal: ['', Validators.required],
      descr: [''],
      time: ['']
    });

    this.activityForm = this.fb.group({
        descr: [''],
        frequency: [''],
        intensity: ['']
    });

    this.alcoholForm = this.fb.group({
        descr: [''],
        frequency: [''],
        intensity: ['']
    });

    this.smokeForm = this.fb.group({
        descr: [''],
        frequency: [''],
        intensity: ['']
    });

    this.habbitsForm.get('activity')?.valueChanges.subscribe(value => {
        console.log('Atividade Física Regular:', value);
    });

    // Get version from the consuming app's configuration
    const config = this.configService.getConfig();
    this.version = config?.version || '';
  }

  ngOnInit(): void {

    this.profileService.getProfileData('Habbits')
    .then(data => {
        console.log('Dados do usuário:', data);
        this.habbitsForm.patchValue(data);
        this.initialHabbitsFormValue = { ...this.habbitsForm.value };
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });

this.profileService.getProfileData('ActivityDetails')
    .then(data => {
        console.log('Dados do usuário:', data);
        this.activityForm.patchValue(data);
        this.initialActivityForm = { ...this.activityForm.value };
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });

this.profileService.getProfileData('AlcoholDetails')
    .then(data => {
        console.log('Dados do usuário:', data);
        this.alcoholForm.patchValue(data);
        this.initialAlcoholForm = { ...this.alcoholForm.value };
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });

this.profileService.getProfileData('SmokeDetails')
    .then(data => {
        console.log('Dados do usuário:', data);
        this.smokeForm.patchValue(data);
        this.initialSmokeForm = { ...this.smokeForm.value };
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });

this.profileService.getProfileData('DietDetails')
    .then(data => {
        console.log('Dados do usuário:', data);

        data.sort((a: Meal, b: Meal) => {
            const timeA = a.time.split(':').map(Number); // Convert time string to array of numbers [HH, MM, SS]
            const timeB = b.time.split(':').map(Number); // Convert time string to array of numbers [HH, MM, SS]
            
            // Compare the times
            if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0]; // Compare hours
            if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1]; // Compare minutes
            return timeA[2] - timeB[2]; // Compare seconds
        });
        
        for (let i = 0; i < data.length; i++) {

            let mealTemp = this.fb.group({
                meal: ['', Validators.required],
                descr: [''],
                time: ['']
            });

            mealTemp.patchValue(data[i]);
            this.meals.push(mealTemp);

        }
        
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });

  }

  async openModal() {

    const modal = await this.modalCtrl.create({
        component: MealsModalComponent,
        componentProps: {
            meal: null,
            isEditing: false
        }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
        this.meals.push(data);        
        this.mealHasChanged = true;
    }

  }

  async editMeal(index: number) {
    const mealToEdit = this.meals[index];
  
    const modal = await this.modalCtrl.create({
      component: MealsModalComponent,
      componentProps: {
        meal: mealToEdit, // Pass the meal data to edit
        isEditing: true
      }
    });
    modal.present();
  
    const { data, role } = await modal.onWillDismiss();
  
    if (role === 'confirm' && data) {
      this.meals[index] = data;
      this.mealHasChanged = true;
    }
  }

  async deleteMeal(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja excluir esta refeição?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.meals.splice(index, 1); // Remove the meal from the array
          }
        }
      ]
    });

    await alert.present();
    
  }

  getMealLabel(mealValue: string): string {
    const option = this.mealOptions.find(option => option.value === mealValue);
    return option ? option.label : 'Desconhecido';
  }

  prevStep() {
    this.navCtrl.navigateBack('/mind-setting');
  }

  nextStep() {

    const hasHabbitsChanged = JSON.stringify(this.initialHabbitsFormValue) !== JSON.stringify(this.habbitsForm.value);
    const hasActivityChanged = JSON.stringify(this.initialActivityForm) !== JSON.stringify(this.activityForm.value);
    const hasAlcoholChanged = JSON.stringify(this.initialAlcoholForm) !== JSON.stringify(this.alcoholForm.value);
    const hasSmokeChanged = JSON.stringify(this.initialSmokeForm) !== JSON.stringify(this.smokeForm.value);
    const hasMealsChanged = this.mealHasChanged; // Already tracked when user adds/edits meals

    const saveRequests: Promise<any>[] = [];

    if (hasHabbitsChanged) {
        saveRequests.push(this.profileService.saveStepData('Habbits', this.habbitsForm.value));
    }
    if (hasMealsChanged) {
        const mealValues = this.meals.map(meal => meal.value);
        saveRequests.push(this.profileService.saveStepData('DietDetails', mealValues));
    }
    if (hasActivityChanged) {
        saveRequests.push(this.profileService.saveStepData('ActivityDetails', this.activityForm.value));
    }
    if (hasAlcoholChanged) {
        saveRequests.push(this.profileService.saveStepData('AlcoholDetails', this.alcoholForm.value));
    }
    if (hasSmokeChanged) {
        saveRequests.push(this.profileService.saveStepData('SmokeDetails', this.smokeForm.value));
    }

    if (saveRequests.length > 0) {
        Promise.all(saveRequests)
            .then(() => {
                this.navCtrl.navigateForward('/excrements');
            })
            .catch(error => {
                console.error('Erro ao salvar:', error);
            });
    } else {
        console.log('Nenhuma alteração detectada, pulando atualização.');
        this.navCtrl.navigateForward('/excrements');
    }
  }

}
