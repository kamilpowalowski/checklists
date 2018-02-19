import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { NbCardModule, NbCheckboxModule, NbMenuModule } from '@nebular/theme';
import { EmojiModule } from 'angular-emojione';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '../shared/shared.module';
import { AccountChecklistsComponent } from './account-checklists/account-checklists.component';
import { ChecklistItemComponent } from './checklist/checklist-item/checklist-item.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { ChecklistsItemsComponent } from './checklists/checklists-items/checklists-items.component';
import { ChecklistsMenuComponent } from './checklists/checklists-menu/checklists-menu.component';
import { ChecklistsTagsComponent } from './checklists/checklists-tags/checklists-tags.component';
import { ChecklistsComponent } from './checklists/checklists.component';
import { EditChecklistComponent } from './edit-checklist/edit-checklist.component';
import { MarkdownEditorComponent } from './edit-checklist/markdown-editor/markdown-editor.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ChecklistsRoutingModule,
    NbCardModule,
    NbCheckboxModule,
    NbMenuModule,
    MarkdownModule.forChild(),
    EmojiModule,
    CovalentTextEditorModule
  ],
  declarations: [
    ChecklistsComponent,
    ChecklistComponent,
    ChecklistItemComponent,
    ChecklistsTagsComponent,
    ChecklistsItemsComponent,
    ChecklistsMenuComponent,
    AccountChecklistsComponent,
    EditChecklistComponent,
    MarkdownEditorComponent
  ]
})
export class ChecklistsModule { }
