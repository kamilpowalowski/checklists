import { OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ChecklistFormComponent } from './checklist-form.component';

export class ChecklistCreateComponent extends ChecklistFormComponent implements OnInit, OnDestroy {

  private localStorageSubscription: Subscription | null;

  ngOnInit() {
    super.ngOnInit();
    this.handleLocalStorage();
    this.form.patchValue({
      'owner': this.accountService.account.getValue().id,
      'public': false
    });
  }

  ngOnDestroy() {
    this.localStorageSubscription.unsubscribe();
  }

  onSave(quit: boolean) {
    const checklist = this.mapFormDataToChecklist(this.form.value);
    this.checklistService.saveChecklist(checklist)
      .subscribe(id => {
        window.localStorage.removeItem('form-data');
        if (quit) {
          this.onDiscard();
        } else {
          this.router.navigate(['/checklists', 'edit', id]);
        }
      });
  }

  onDiscard() {
    window.localStorage.removeItem('form-data');
    super.onDiscard();
  }

  private handleLocalStorage() {
    // Autosafe form data to local storage
    this.localStorageSubscription = this.form.valueChanges
      .debounceTime(10 * 1000)
      .subscribe(newValues => {
        const valuesAsJsonString = JSON.stringify(newValues);
        window.localStorage.setItem('form-data', valuesAsJsonString);
      });

    const values = JSON.parse(window.localStorage.getItem('form-data'));
    if (values) {
      this.initItemsAndSubitems(values.items);
      this.form.patchValue(values);
    }
  }

  private initItemsAndSubitems(items: any[]) {
    for (const item of items) {
      const formItem = this.addNewItem();
      for (const subitems of item.subitems) {
        this.addNewSubitem(formItem);
      }
    }
  }
}
