import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbCheckboxModule, NbMenuModule } from '@nebular/theme';
import { MarkdownModule } from 'ngx-markdown';
import { EmojiModule } from 'angular-emojione';
import { SharedModule } from '../shared/shared.module';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsComponent } from './checklists/checklists.component';
import { ChecklistItemComponent } from './checklist/checklist-item/checklist-item.component';
import { ChecklistsTagsComponent } from './checklists/checklists-tags/checklists-tags.component';
import { ChecklistsItemsComponent } from './checklists/checklists-items/checklists-items.component';
import { ChecklistsMenuComponent } from './checklists/checklists-menu/checklists-menu.component';
import { AccountChecklistsComponent } from './account-checklists/account-checklists.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChecklistsRoutingModule,
    NbCardModule,
    NbCheckboxModule,
    NbMenuModule,
    MarkdownModule.forChild(),
    EmojiModule
  ],
  declarations: [
    ChecklistsComponent,
    ChecklistComponent,
    ChecklistItemComponent,
    ChecklistsTagsComponent,
    ChecklistsItemsComponent,
    ChecklistsMenuComponent,
    AccountChecklistsComponent
  ]
})
export class ChecklistsModule { }
