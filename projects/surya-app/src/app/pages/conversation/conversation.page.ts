import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChatService } from '../../services/chat.service';
import { chatItem } from '../../interfaces/chat';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ConversationPage implements OnInit {

    question: string = '';
    version: string = environment.version;

    constructor(public chatService: ChatService
    ) {}

    ngOnInit() {
      if (this.chatService.chat.length === 0) {

        const salute: chatItem = {
          originator: 'Surya',
        message: 'Olá, sou Surya, seu assistente de saúde e bem estar. Como posso ajudar você hoje?'
        };

        this.chatService.addChatItem(salute);
      }
    }

    onSubmit() {
      if (this.question.trim()) {
        this.chatService.submitQuestion(this.question, false);
        this.question = '';
      }
    }

    onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.onSubmit();
      }
    }

}
