import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { EmojiModule } from 'angular-emojione';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    NbCardModule,
    EmojiModule
  ],
  declarations: [AccountComponent]
})
export class AccountModule { }
