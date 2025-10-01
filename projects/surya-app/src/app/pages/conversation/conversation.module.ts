import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationPageRoutingModule } from './conversation-routing.module';

import { ConversationPage } from './conversation.page';
import { TabsComponentModule } from '../../components/tabs/tabs.module';
import { HeaderModule } from 'surya-lib/components/header/header.module';
import { SpinnerModule } from 'surya-lib/components/spinner/spinner.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationPageRoutingModule,
    TabsComponentModule,
    HeaderModule,
    SpinnerModule
  ],
  declarations: [ConversationPage]
})
export class ConversationPageModule {}
