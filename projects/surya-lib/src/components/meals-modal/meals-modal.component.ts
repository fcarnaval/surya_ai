import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { MEAL_OPTIONS } from '../../options/meal-options';


@Component({
  selector: 'app-meals-modal',
  templateUrl: './meals-modal.component.html',
  styleUrls: ['./meals-modal.component.scss'],
})

export class MealsModalComponent implements OnInit {

    @Input() meal: any;
    @Input() isEditing: boolean = false;
    mealForm: FormGroup;
    mealOptions = MEAL_OPTIONS;

    constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
        this.mealForm = this.fb.group({
            meal: [''],
            descr: [''],
            time: ['']
        });
    }

    ngOnInit(): void {
        
        if (this.isEditing && this.meal) {
        this.mealForm.patchValue(this.meal);
        }

    }

    cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
    }

    confirm() {
        console.log("Form saved: " + JSON.stringify(this.mealForm.value));
        return this.modalCtrl.dismiss(this.mealForm, 'confirm');
    }

}