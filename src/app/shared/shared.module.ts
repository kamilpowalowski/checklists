import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccountService } from './services/account.service';
import { AuthenticatedGuard } from './services/authenticated-guard.service';
import { ChecklistService } from './services/checklist.service';
import { ChecklistsService } from './services/checklists.service';
import { FirebaseAuthenticationProvider } from './services/firebase-authentication.provider';
import { ReportService } from './services/report.service';
import { SaveService } from './services/save.service';
import { TagsService } from './services/tags.service';
import { UserService } from './services/user.service';

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
    UserService,
    SaveService,
    ReportService
  ]
})
export class SharedModule { }
