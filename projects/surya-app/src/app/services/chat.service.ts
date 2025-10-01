import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { chatItem } from '../interfaces/chat';
import { environment } from '../../environments/environment';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { interval, of } from 'rxjs';
import { switchMap, takeWhile, catchError, take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SpinnerService } from 'surya-lib/public-api';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chat: chatItem[] = [];

  processing = false;
  value = 50;

  session_id: string = "";

  apiHost = environment.apiHost;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private spinner: SpinnerService
  ) {             
    this.session_id = uuidv4();
  }

  addChatItem(item: chatItem) {
    this.chat.push(item);
  }

  submitQuestion(input: string, navigate: boolean) {
    console.log("processing");
    this.spinner.processing = true;
    const html = document.querySelector("html");

    const question: chatItem = {
      originator: 'User',
      message: input
    };

    this.chat.push(question);

    if (navigate) this.navCtrl.navigateForward('/conversation');

    this.startAsyncFlow(input);

  }

  getChatAnswer(input: string): Observable<any> {
    const body = { question: input };

    return new Observable<any>((observer) => {
      this.http.post(this.apiHost + 'submit-question/', body).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  startAsyncFlow(input: string) {
    const body = { question: input, session_id: this.session_id };

    this.http.post<{ job_id: string }>(this.apiHost + 'submit-question/', body).subscribe({
      next: (res) => {
        const jobId = res.job_id;
        this.pollForJobResultRx(jobId);
      },
      error: (err) => {
        console.error("Erro ao enviar pergunta:", err);
        this.spinner.processing = false;
      }
    });
  }  

  pollJobStatus(jobId: string, attempt: number) {
    const maxAttempts = 60;
    const delayMs = 2000;

    this.http.get<{ status: string, result?: string, error: string }>(`${this.apiHost}check-job-status?job_id=${jobId}`).subscribe({
        next: (res) => {
        console.log(`res: ${JSON.stringify(res)}`);
        if (res.status === 'COMPLETED' && res.result) {
            const markdownHtml = marked.parse(res.result) as string;
            const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(markdownHtml);

            this.adicionarGradualmente(res.result);
            this.spinner.processing = false;
            document.querySelector("html")?.setAttribute("style", "opacity: 1");
        } else if (res.status === 'FAILED') {
            console.error("Processamento falhou.");
            this.spinner.processing = false;

            const errorMessage = res.error || "Ocorreu um erro ao processar sua pergunta. Tente novamente mais tarde.";
            const answer: chatItem = {
                originator: 'Surya',
                message: errorMessage
            };

            this.chat.push(answer);
            this.spinner.processing = false;
            console.error("Erro no processamento:", errorMessage);
        } else {
            console.log(`JobId: ${jobId} attemp: ${attempt}`);
            // ainda em processamento: tenta de novo
            if (attempt < maxAttempts) {
                setTimeout(() => this.pollJobStatus(jobId, attempt + 1), delayMs);
            } else {
                const errorMessage = res.error || "O servidor não respondeu sua mensagem no tempo esperado. Tente novamente mais tarde.";
                const answer: chatItem = {
                    originator: 'Surya',
                    message: errorMessage
                };

                this.chat.push(answer);
                console.error("Tempo limite atingido.");
                this.spinner.processing = false;
            }
        }
        },
        error: (err) => {
        console.error("Erro ao consultar status:", err);
        this.spinner.processing = false;
        }
    });
  }

  pollForJobResultRx(jobId: string) {
    let attempts = 0;
    const maxAttempts = 60;
    const polling$ = interval(2000).pipe(
      take(maxAttempts),
      switchMap(() => {
        attempts++;
        return this.http.get<any>(`${this.apiHost}check-job-status?job_id=${jobId}`);
      }),
      takeWhile((statusResponse) => {
          console.log(`JobId: ${jobId} attemp: ${attempts}`);
          console.log(`res: ${JSON.stringify(statusResponse)}`);
          const status = statusResponse.status;

          if (status === 'COMPLETED') {
            const respostaBruta = statusResponse.result;
            const markdownHtml = marked.parse(respostaBruta) as string;
            const safeHtml = this.sanitizer.bypassSecurityTrustHtml(markdownHtml);
            this.adicionarGradualmente(respostaBruta);
            this.spinner.processing = false;
            document.querySelector("html")?.setAttribute("style", "opacity: 1");
            return false;
          }

          if (status === 'FAILED') {
            const errorMessage = statusResponse.error || "Ocorreu um erro ao processar sua pergunta.";
            const answer: chatItem = {
                originator: 'Surya',
                message: errorMessage
            };
            this.chat.push(answer);
            this.spinner.processing = false;
            console.error("Erro no processamento:", errorMessage);
            return false;
          }
        return true;
      }, true),
      catchError((err) => {
        console.error("Erro ao consultar status do job:", err);
        this.spinner.processing = false;
        return of();
      })
    );

    polling$.subscribe({
      complete: () => {
        if (attempts >= maxAttempts) {
          const timeoutMsg = "⏱️ O tempo de espera foi excedido. Tente novamente mais tarde.";
          this.chat.push({ originator: 'Surya', message: timeoutMsg });
          this.spinner.processing = false;
        }
      }
    });

  }


  adicionarGradualmente(respostaMarkdown: string) {
    const htmlCompleto = marked.parse(respostaMarkdown) as string;
    const chars = Array.from(htmlCompleto);
  
    const newMessage: chatItem = {
      originator: 'Surya',
      message: ''
    };
  
    this.chat.push(newMessage);
  
    let i = 0;
    const interval = setInterval(() => {
      if (i < chars.length) {
        newMessage.message += chars[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 8);
  }  

}
