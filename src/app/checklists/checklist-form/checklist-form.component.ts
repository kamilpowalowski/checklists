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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TagModel } from 'ngx-chips/core/accessor';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/debounceTime';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ModalComponent } from '../../modal/modal.component';
import { AccountService } from './../../shared/account.service';
import { ChecklistItem } from './../../shared/checklist-item.model';
import { Checklist } from './../../shared/checklist.model';
import { ChecklistService } from './../../shared/checklist.service';

@Component({
  selector: 'app-checklist-form',
  templateUrl: './checklist-form.component.html',
  styleUrls: ['./checklist-form.component.scss']
})
export class ChecklistFormComponent implements OnInit {
  form: FormGroup;
  saveInProgress: boolean;

  returnUrl: string;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected checklistService: ChecklistService
  ) { }

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['return-url'];
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

  onSave() {
    this.saveInProgress = true;
    const checklist = this.mapFormDataToChecklist(this.form.value);
    this.checklistService.saveChecklist(checklist)
      .subscribe(
        id => {
          this.saveInProgress = false;
          this.onDiscard();
        },
        error => {
          this.saveInProgress = false;
          ModalComponent.showModalError(this.modalService, error);
        }
      );
  }

  onSaved(checklistId: string) {

  }

  onDiscard() {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(['/checklists', 'me', 'all']);
    }
  }

  protected mapFormDataToChecklist(value: any): Checklist {
    const items = Observable.of(
      this.mapSubformDataToChecklistItems(value['items'])
    );
    const tags = value['tags'].map(tag => tag.slice(1));
    return new Checklist(
      value['id'], value['owner'], value['title'],
      value['description'], tags, value['public'], items
    );
  }

  private initForm() {
    this.form = new FormGroup({
      'id': new FormControl(),
      'owner': new FormControl(),
      'public': new FormControl(),
      'title': new FormControl('', Validators.required),
      'tags': new FormControl(),
      'description': new FormControl(),
      'items': new FormArray([])
    });
  }

  private mapSubformDataToChecklistItems(value: any): ChecklistItem[] {
    if (!value) { return []; }
    return value.map((item, index) => {
      const subitems = this.mapSubformDataToChecklistItems(item['subitems']);
      return new ChecklistItem(item['id'], index + 1, item['title'], item['description'], subitems);
    });
  }
}
