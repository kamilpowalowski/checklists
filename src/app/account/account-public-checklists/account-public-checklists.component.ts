import { Component, Input, OnInit } from '@angular/core';
import { Checklist } from '../../shared/models/checklist.model';

@Component({
  selector: 'app-account-public-checklists',
  templateUrl: './account-public-checklists.component.html',
  styleUrls: ['./account-public-checklists.component.scss']
})
export class AccountPublicChecklistsComponent implements OnInit {

  @Input() checklists: Checklist[];

  constructor() { }

  ngOnInit() {
  }


}
