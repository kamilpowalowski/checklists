import { TagsService } from './tags.service';
import { ChecklistsService } from './checklists.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistService } from './checklist.service';
import { AccountService } from './account.service';
import { FirebaseAuthenticationProvider } from './firebase-authentication.provider';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ChecklistsService,
    ChecklistService,
    TagsService,
    AccountService,
    FirebaseAuthenticationProvider
  ]
})
export class SharedModule { }
