import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { ChecklistDetailsComponent } from './checklist-details/checklist-details.component';
import { ChecklistsCollectionComponent } from './checklists-collection/checklists-collection.component';
import { NbCardModule, NbCheckboxModule } from '@nebular/theme';
import { ChecklistItemComponent } from './checklist-details/checklist-item/checklist-item.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChecklistsRoutingModule,
    NbCardModule,
    NbCheckboxModule,
    MarkdownModule.forChild()
  ],
  declarations: [
    ChecklistDetailsComponent,
    ChecklistsCollectionComponent,
    ChecklistItemComponent
  ]
})
export class ChecklistsModule { }
