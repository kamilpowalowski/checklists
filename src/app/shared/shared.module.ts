import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccountService } from './account.service';
import { AuthenticatedGuard } from './authenticated-guard.service';
import { ChecklistService } from './checklist.service';
import { ChecklistsService } from './checklists.service';
import { FirebaseAuthenticationProvider } from './firebase-authentication.provider';
import { TagsService } from './tags.service';
import { UserService } from './user.service';

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
    FirebaseAuthenticationProvider,
    AuthenticatedGuard,
    UserService
  ]
})
export class SharedModule { }
