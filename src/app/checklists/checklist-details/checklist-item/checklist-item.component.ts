import { ChecklistItem } from '../../../shared/checklist-item.model';
import { Component, OnInit, Input } from '@angular/core';
import { Checklist } from '../../../shared/checklist.model';


@Component({
  selector: 'app-checklist-item',
  templateUrl: './checklist-item.component.html',
  styleUrls: ['./checklist-item.component.scss']
})
export class ChecklistItemComponent implements OnInit {
  @Input() item: ChecklistItem;
  @Input() level: number;

  constructor() { }

  ngOnInit() {
  }

  getClassesForLevel(level: number): string[] {
    const columnClass = 'col-md-' + (12 - level);
    const offsetClass = 'offset-md-' + level;
    return [columnClass, offsetClass];
  }

  shouldPresentDescription(): boolean {
    return this.item.description != null && this.item.description.length > 0;
  }

}
