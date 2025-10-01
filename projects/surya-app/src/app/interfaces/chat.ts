import { SafeHtml } from '@angular/platform-browser';

export interface chatItem {
  originator: string;
  message: string | SafeHtml;
}