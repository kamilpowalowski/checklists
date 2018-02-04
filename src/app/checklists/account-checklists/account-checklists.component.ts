import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Checklist } from '../../shared/checklist.model';
import { ChecklistsService } from '../../shared/checklists.service';
import { TagsService } from '../../shared/tags.service';
import { ChecklistsTagsComponent } from '../checklists/checklists-tags/checklists-tags.component';

@Component({
  selector: 'app-account-checklists',
  templateUrl: './account-checklists.component.html',
  styleUrls: ['./account-checklists.component.scss']
})
export class AccountChecklistsComponent implements OnInit, OnDestroy {

  @ViewChild('tagsComponent') tagsComponent: ChecklistsTagsComponent;

  tags: Observable<string[]>;
  checklists: Observable<Checklist[]>;

  private routerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private checklistsService: ChecklistsService) { }

  ngOnInit() {
    this.tags = this.tagsService.observeAccountTags();

    this.routerSubscription = this.route.params
      .subscribe(params => {
        const tag = params['tag'];
        this.checklists = this.checklistsService.observeAccountChecklists(tag);
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
