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
    ChecklistService,
    AccountService
  ]
})
export class SharedModule { }
