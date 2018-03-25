import { Component, Input, OnInit } from '@angular/core';
import { Checklist } from '../../../shared/models/checklist.model';

@Component({
  selector: 'app-checklists-items',
  templateUrl: './checklists-items.component.html',
  styleUrls: ['./checklists-items.component.scss']
})
export class ChecklistsItemsComponent implements OnInit {
  @Input() checklists: Checklist[];

  constructor() { }

  ngOnInit() {
  }

}
