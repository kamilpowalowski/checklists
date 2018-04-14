import { Component, Input, OnInit } from '@angular/core';
import { Checklist } from '../../../shared/models/checklist.model';

@Component({
  selector: 'app-checklist-admin-actions',
  templateUrl: './checklist-admin-actions.component.html',
  styleUrls: ['./checklist-admin-actions.component.scss']
})
export class ChecklistAdminActionsComponent implements OnInit {

  @Input() checklist: Checklist;
  isFeatured: boolean;

  constructor() { }

  ngOnInit() {
  }

  feature() {

  }

  unfeature() {

  }
}
