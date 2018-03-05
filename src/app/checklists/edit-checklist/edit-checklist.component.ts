import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
  } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModel } from 'ngx-chips/core/accessor';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/debounceTime';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ChecklistItem } from './../../shared/checklist-item.model';
import { Checklist } from './../../shared/checklist.model';
import { ChecklistService } from './../../shared/checklist.service';

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.scss']
})
export class EditChecklistComponent implements OnInit, OnDestroy {
  form: FormGroup;

  private routerSubscription: Subscription;
  private localStorageSubscription: Subscription | null;
  private isNew: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checklistService: ChecklistService
  ) { }

  ngOnInit() {
    this.initForm();

    this.routerSubscription = Observable.combineLatest(
      this.route.data,
      this.route.params
    )
      .subscribe(value => {
        const data = value[0];
        this.isNew = data['new'];

        const params = value[1];
        const id = params['id'];

        if (!this.isNew && id) {
          this.loadChecklistForEdit(id);
        } else if (this.isNew) {
          this.handleLocalStorage();
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    if (this.localStorageSubscription) {
      this.localStorageSubscription.unsubscribe();
    }
  }

  items(): AbstractControl[] {
    return (this.form.get('items') as FormArray).controls;
  }

  subitemsForItem(item: AbstractControl): AbstractControl[] {
    return (item.get('subitems') as FormArray).controls;
  }

  addNewItem(): FormGroup {
    const items = this.form.get('items') as FormArray;
    const newItem = new FormGroup({
      'id': new FormControl(),
      'title': new FormControl('', Validators.required),
      'description': new FormControl(),
      'subitems': new FormArray([])
    });
    items.push(newItem);
    return newItem;
  }

  addNewSubitem(item: FormGroup): FormGroup {
    const subitems = item.get('subitems') as FormArray;
    const newItem = new FormGroup({
      'id': new FormControl(),
      'title': new FormControl('', Validators.required),
      'description': new FormControl()
    });
    subitems.push(newItem);
    return newItem;
  }

  removeItem(index: number) {
    const items = this.form.get('items') as FormArray;
    items.removeAt(index);
  }

  removeSubitem(index: number, item: FormArray) {
    const subitems = item.get('subitems') as FormArray;
    subitems.removeAt(index);
  }

  showWarningForField(name: string): boolean {
    return !this.form.get(name).valid && this.form.get(name).touched;
  }

  moveItemUp(index: number) {
    const items = this.form.get('items') as FormArray;
    const item = items.at(index);
    items.removeAt(index);
    items.insert(index - 1, item);
  }

  moveItemDown(index: number) {
    const items = this.form.get('items') as FormArray;
    const item = items.at(index);
    items.removeAt(index);
    items.insert(index + 1, item);
  }

  moveSubitemUp(index: number, item: FormArray) {
    const subitems = item.get('subitems') as FormArray;
    const subitem = subitems.at(index);
    subitems.removeAt(index);
    subitems.insert(index - 1, subitem);
  }

  moveSubitemDown(index: number, item: FormArray) {
    const subitems = item.get('subitems') as FormArray;
    const subitem = subitems.at(index);
    subitems.removeAt(index);
    subitems.insert(index + 1, subitem);
  }

  transformNewTag(tag: string): Observable<string> {
    const transformedTag = tag.replace(/[^\w\s]/gi, '').toLowerCase();
    if (transformedTag.length === 0) {
      return Observable.never();
    }
    return Observable.of(`#${transformedTag}`);
  }

  onSave(quit: boolean) {
    const checklist = this.mapFormDataToChecklist(this.form.value);
    this.checklistService.saveChecklist(checklist)
      .subscribe(id => {
        if (this.localStorageSubscription) {
          this.localStorageSubscription.unsubscribe();
        }

        window.localStorage.removeItem('form-data');
        if (quit) {
          this.router.navigate(['/checklists', 'me', 'all']);
        } else if (this.isNew) {
          this.router.navigate(['/checklists', 'edit', id]);
        }
      });
  }

  onDiscard() {
    window.localStorage.removeItem('form-data');
    this.router.navigate(['/checklists', 'me', 'all']);
  }

  private initForm() {
    this.form = new FormGroup({
      'id': new FormControl(),
      'title': new FormControl('', Validators.required),
      'tags': new FormControl(),
      'description': new FormControl(),
      'items': new FormArray([])
    });
  }

  private initItemsAndSubitems(items: any[]) {
    for (const item of items) {
      const formItem = this.addNewItem();
      for (const subitems of item.subitems) {
        this.addNewSubitem(formItem);
      }
    }
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

  private mapFormDataToChecklist(value: any): Checklist {
    const items = Observable.of(
      this.mapSubformDataToChecklistItems(value['items'])
    );
    const tags = value['tags'].map(tag => tag.slice(1));
    return new Checklist(value['id'], value['title'], value['description'], tags, value['public'], items);
  }

  private mapSubformDataToChecklistItems(value: any): ChecklistItem[] {
    if (!value) { return []; }
    return value.map((item, index) => {
      const subitems = this.mapSubformDataToChecklistItems(item['subitems']);
      return new ChecklistItem(item['id'], index + 1, item['title'], item['description'], subitems);
    });
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
}
