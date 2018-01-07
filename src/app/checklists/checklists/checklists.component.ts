import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChecklistsTagsComponent } from './checklists-tags/checklists-tags.component';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class ChecklistsComponent implements OnInit {
  @ViewChild('tagsComponent') tagsComponent: ChecklistsTagsComponent;

  tags = ['ci', 'angular'];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      const tag = params['tag'];
    });
  }

}
