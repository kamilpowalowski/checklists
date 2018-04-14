import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import {
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbMenuModule,
  NbPopoverModule,
  NbUserModule
  } from '@nebular/theme';
import { EmojiModule } from 'angular-emojione';
import { ToasterModule } from 'angular2-toaster';
import { TagInputModule } from 'ngx-chips';
import { MarkdownModule } from 'ngx-markdown';
import { ModalsModule } from '../modals/modals.module';
import { SharedModule } from '../shared/shared.module';
import { AccountChecklistsComponent } from './account-checklists/account-checklists.component';
import { ChecklistCreateComponent } from './checklist-form/checklist-create.component';
import { ChecklistEditComponent } from './checklist-form/checklist-edit.component';
import { ChecklistFormComponent } from './checklist-form/checklist-form.component';
import { MarkdownEditorComponent } from './checklist-form/markdown-editor/markdown-editor.component';
import { ChecklistActionsComponent } from './checklist/checklist-actions/checklist-actions.component';
import { ChecklistItemComponent } from './checklist/checklist-item/checklist-item.component';
import { ChecklistOwnerActionsComponent } from './checklist/checklist-owner-actions/checklist-owner-actions.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { ChecklistsItemsComponent } from './checklists/checklists-items/checklists-items.component';
import { ChecklistsMenuComponent } from './checklists/checklists-menu/checklists-menu.component';
import { ChecklistsTagsComponent } from './checklists/checklists-tags/checklists-tags.component';
import { ChecklistsComponent } from './checklists/checklists.component';
import { ChecklistAdminActionsComponent } from './checklist/checklist-admin-actions/checklist-admin-actions.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ChecklistsRoutingModule,
    NbCardModule,
    NbCheckboxModule,
    NbActionsModule,
    NbPopoverModule,
    NbMenuModule,
    NbUserModule,
    MarkdownModule.forChild(),
    ToasterModule.forChild(),
    EmojiModule,
    CovalentTextEditorModule,
    TagInputModule,
    ModalsModule
  ],
  declarations: [
    ChecklistsComponent,
    ChecklistComponent,
    ChecklistItemComponent,
    ChecklistsTagsComponent,
    ChecklistsItemsComponent,
    ChecklistsMenuComponent,
    AccountChecklistsComponent,
    ChecklistFormComponent,
    ChecklistEditComponent,
    ChecklistCreateComponent,
    MarkdownEditorComponent,
    ChecklistOwnerActionsComponent,
    ChecklistActionsComponent,
    ChecklistAdminActionsComponent
  ]
})
export class ChecklistsModule { }
