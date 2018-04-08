import { Component, Input, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Checklist } from '../../../shared/models/checklist.model';

@Component({
  selector: 'app-home-featured-checklists',
  templateUrl: './home-featured-checklists.component.html',
  styleUrls: ['./home-featured-checklists.component.scss']
})
export class HomeFeaturedChecklistsComponent implements OnInit {
  @Input() checklists: Checklist[];

  constructor() { }

  ngOnInit() {
  }

}
