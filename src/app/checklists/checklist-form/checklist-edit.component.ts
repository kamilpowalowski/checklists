import { OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ChecklistItem } from '../../shared/checklist-item.model';
import { Checklist } from '../../shared/checklist.model';
import { ChecklistFormComponent } from './checklist-form.component';

export class ChecklistEditComponent extends ChecklistFormComponent implements OnInit, OnDestroy {
  private routerSubscription: Subscription;

  ngOnInit() {
    super.ngOnInit();

    this.routerSubscription = this.route.params
      .subscribe(params => {
        const id = params['id'];

        if (id) {
          this.loadChecklistForEdit(id);
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  onSave(quit: boolean) {
    const checklist = this.mapFormDataToChecklist(this.form.value);
    this.checklistService.saveChecklist(checklist)
      .subscribe(_ => {
        if (quit) { this.onDiscard(); }
      });
  }

  private loadChecklistForEdit(id: string) {
    this.checklistService.observeChecklist(id, true)
      .take(1)
      .subscribe(checklist => {
        this.loadChecklistToForm(checklist);
        this.loadChecklistItemsForEdit(checklist.items, null, 'items');
      });
  }

  private loadChecklistToForm(checklist: Checklist) {
    const values = {
      'id': checklist.id,
      'public': checklist.isPublic,
      'title': checklist.title,
      'tags': checklist.tags.map(tag => `#${tag}`),
      'description': checklist.description
    };
    this.form.patchValue(values);
  }

  private loadChecklistItemsForEdit(observableItems: BehaviorSubject<ChecklistItem[]>, formGroup: FormGroup | null, subpath: string) {
    observableItems
      .subscribe(items => {
        const formGroups = this.loadChecklistItemsToForm(items, formGroup, subpath);
        items.forEach((item, index) => {
          this.loadChecklistItemsToForm(item.subitems, formGroups[index], `subitems`);
        });
      });
  }

  private loadChecklistItemsToForm(items: ChecklistItem[], formGroup: FormGroup | null, subpath: string): FormGroup[] {
    const formGroups = [];
    const values = items.map(item => {
      formGroups.push(formGroup ? this.addNewSubitem(formGroup) : this.addNewItem());
      return {
        'id': item.id,
        'title': item.title,
        'description': item.description
      };
    });
    (formGroup ? formGroup : this.form).patchValue({ [subpath]: values });
    return formGroups;
  }
}
