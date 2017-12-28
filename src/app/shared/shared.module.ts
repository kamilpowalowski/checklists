import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistService } from './checklist.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ChecklistService
  ]
})
export class SharedModule { }
