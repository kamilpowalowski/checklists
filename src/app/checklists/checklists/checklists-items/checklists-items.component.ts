import { Component, OnInit, Input } from '@angular/core';
import { Checklist } from './../../../shared/checklist.model';

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
