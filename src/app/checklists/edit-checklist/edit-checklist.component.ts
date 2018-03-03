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

        if (this.isNew) {
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
    if (this.isNew) {
      const checklist = this.mapFormDataToChecklist(this.form.value);
      this.checklistService.createNewChecklist(checklist)
        .subscribe(id => {
          if (this.localStorageSubscription) {
            this.localStorageSubscription.unsubscribe();
          }

          window.localStorage.removeItem('form-data');
          if (quit) {
            this.router.navigate(['/checklists', 'me', 'all']);
          } else {
            this.router.navigate(['/checklists', 'edit', id]);
          }
        });
    }
  }

  onDiscard() {
    window.localStorage.removeItem('form-data');
    this.router.navigate(['/checklists', 'me', 'all']);
  }

  private initForm() {
    this.form = new FormGroup({
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

  private mapFormDataToChecklist(value: any): Checklist {
    const items = Observable.of(
      this.mapSubformDataToChecklistItems(value['items'])
    );
    const tags = value['tags'].map(tag => tag.slice(1));

    return new Checklist(null, value['title'], value['description'], tags, items);
  }

  private mapSubformDataToChecklistItems(value: any): ChecklistItem[] {
    if (!value) { return []; }
    return value.map((item, index) => {
      const items = Observable.of(
        this.mapSubformDataToChecklistItems(item['subitems'])
      );

      return new ChecklistItem(null, index + 1, item['title'], item['description'], items);
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
