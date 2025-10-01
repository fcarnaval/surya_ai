import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  processing: boolean = false;

  spin(){
    this.processing = true;
  }

  stop(){
    this.processing = false;
  }

}