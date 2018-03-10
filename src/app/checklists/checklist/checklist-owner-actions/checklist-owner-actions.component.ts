import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Checklist } from './../../../shared/checklist.model';

@Component({
  selector: 'app-checklist-owner-actions',
  templateUrl: './checklist-owner-actions.component.html',
  styleUrls: ['./checklist-owner-actions.component.scss']
})
export class ChecklistOwnerActionsComponent implements OnInit {

  @Input() checklist: Checklist;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  edit() {
    this.router.navigate(['/checklists', 'edit', this.checklist.id]);
  }

  public() {
    // TODO: Implement
  }

  share() {
    // TODO: Implement
  }

  delete() {
    // TODO: Implement
  }

}
