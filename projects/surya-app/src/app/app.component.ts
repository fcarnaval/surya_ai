import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';
import { SpinnerService } from 'surya-lib/components/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    constructor(private spinnerService: SpinnerService) {}

    get processing() { return this.spinnerService.processing }

}

