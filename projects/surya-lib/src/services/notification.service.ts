import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private confirmationSubject = new BehaviorSubject<string | null>(null);
  public confirmation$ = this.confirmationSubject.asObservable();

  showConfirmation(message: string) {
    this.confirmationSubject.next(message);
  }

  clearConfirmation() {
    this.confirmationSubject.next(null);
  }
}