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
import { ActivatedRoute } from '@angular/router';
import { TagModel } from 'ngx-chips/core/accessor';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.scss']
})
export class EditChecklistComponent implements OnInit, OnDestroy {
  form: FormGroup;

  private routerSubscription: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();

    this.routerSubscription = Observable.combineLatest(
      this.route.data,
      this.route.params
    )
      .subscribe(value => {
        const data = value[0];
        const isNew: boolean = data['new'];

        const params = value[1];
        const id = params['id'];

        if (isNew) {
          this.handleLocalStorage();
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
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
      'subitems': new FormArray([])
    });
    items.push(newItem);
    return newItem;
  }

  addNewSubitem(item: FormGroup): FormGroup {
    const subitems = item.get('subitems') as FormArray;
    const newItem = new FormGroup({
      'title': new FormControl('', Validators.required),
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

  onSave() {
    window.localStorage.removeItem('form-data');
  }

  private initForm() {
    this.form = new FormGroup({
      'title': new FormControl('', Validators.required),
      'tags': new FormControl(),
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

  private handleLocalStorage() {
    // Autosafe form data to local storage
    this.form.valueChanges
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
