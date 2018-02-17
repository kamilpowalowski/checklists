import {
  Component,
  ElementRef,
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

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.scss']
})
export class EditChecklistComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  items(): AbstractControl[] {
    return (this.form.get('items') as FormArray).controls;
  }

  subitemsForItem(item: AbstractControl): AbstractControl[] {
    return (item.get('subitems') as FormArray).controls;
  }

  addNewItem() {
    const items = this.form.get('items') as FormArray;
    items.push(
      new FormGroup({
        'title': new FormControl('', Validators.required),
        'subitems': new FormArray([])
      })
    );
  }

  addNewSubitem(item: FormArray) {
    const subitems = item.get('subitems') as FormArray;

    subitems.push(
      new FormGroup({
        'title': new FormControl('', Validators.required),
      })
    );
  }

  removeItem(index: number) {
    const items = this.form.get('items') as FormArray;
    items.removeAt(index);
  }

  removeSubitem(index: number, item: FormArray) {
    const subitems = item.get('subitems') as FormArray;
    subitems.removeAt(index);
  }

  private initForm() {
    this.form = new FormGroup({
      'title': new FormControl('', Validators.required),
      'tags': new FormControl(),
      'items': new FormArray([])
    });
  }

}
