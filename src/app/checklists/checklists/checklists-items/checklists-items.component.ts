import { Component, Input, OnInit } from '@angular/core';
import { Checklist } from '../../../shared/models/checklist.model';

@Component({
  selector: 'app-checklists-items',
  templateUrl: './checklists-items.component.html',
  styleUrls: ['./checklists-items.component.scss']
})
export class ChecklistsItemsComponent implements OnInit {
  @Input() checklists: Checklist[];

  private maxLenght = 40;

  constructor() { }

  ngOnInit() {
  }

  checklistNameUrlForm(checklist: Checklist): string {
    return checklist.title
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .trim();                        // Trim - from end of text;
  }

}
