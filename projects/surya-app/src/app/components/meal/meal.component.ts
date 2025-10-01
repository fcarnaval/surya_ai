import { Time } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss'],
})
export class MealComponent {

    @Input() mealTitle: string = "";
    descricao: string = "";
    horario: string = "";
    como_se_sente: string = "";

    constructor() { }

}
