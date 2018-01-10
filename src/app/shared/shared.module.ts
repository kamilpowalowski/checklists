import { TagsService } from './tags.service';
import { ChecklistsService } from './checklists.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistService } from './checklist.service';
import { AccountService } from './account.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ChecklistsService,
    ChecklistService,
    TagsService,
    AccountService
  ]
})
export class SharedModule { }
