import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { EmojiModule } from 'angular-emojione';
import { SharedModule } from '../shared/shared.module';
import { AccountPublicChecklistsComponent } from './account-public-checklists/account-public-checklists.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    NbCardModule,
    EmojiModule,
    SharedModule
  ],
  declarations: [AccountComponent, AccountPublicChecklistsComponent]
})
export class AccountModule { }
