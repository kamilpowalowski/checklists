import { ChecklistsService } from './../../shared/checklists.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChecklistsTagsComponent } from './checklists-tags/checklists-tags.component';
import { TagsService } from './../../shared/tags.service';
import { Checklist } from './../../shared/checklist.model';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class ChecklistsComponent implements OnInit {
  @ViewChild('tagsComponent') tagsComponent: ChecklistsTagsComponent;

  tags: Observable<string[]>;
  checklists: Observable<Checklist[]>;

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private checklistsService: ChecklistsService) { }

  ngOnInit() {
    this.tags = this.tagsService.observePublicTags();

    this.route.params
      .subscribe((params: Params) => {
        const tag = params['tag'];
        this.checklists = this.checklistsService.observePublicChecklists(tag);
      });
  }

}
