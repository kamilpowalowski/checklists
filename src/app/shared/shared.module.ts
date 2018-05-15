import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccountService } from './services/account.service';
import { AdminService } from './services/admin.service';
import { AuthenticatedGuard } from './services/authenticated-guard.service';
import { ChecklistService } from './services/checklist.service';
import { ChecklistsService } from './services/checklists.service';
import { FirebaseAuthenticationProvider } from './services/firebase-authentication.provider';
import { OpenStartupService } from './services/open-startup.service';
import { ReportService } from './services/report.service';
import { SaveService } from './services/save.service';
import { TagsService } from './services/tags.service';
import { TutorialChecklistService } from './services/tutorial-checklist.service';
import { UserService } from './services/user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ChecklistsService,
    ChecklistService,
    TutorialChecklistService,
    TagsService,
    AccountService,
    FirebaseAuthenticationProvider,
    AuthenticatedGuard,
    UserService,
    SaveService,
    ReportService,
    OpenStartupService,
    AdminService
  ]
})
export class SharedModule { }
