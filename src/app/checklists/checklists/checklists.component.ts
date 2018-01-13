import { Subscription } from 'rxjs/Subscription';
import { ChecklistsService } from './../../shared/checklists.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChecklistsTagsComponent } from './checklists-tags/checklists-tags.component';
import { TagsService } from './../../shared/tags.service';
import { Checklist } from './../../shared/checklist.model';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class ChecklistsComponent implements OnInit, OnDestroy {
  @ViewChild('tagsComponent') tagsComponent: ChecklistsTagsComponent;

  tags: Observable<string[]>;
  checklists: Observable<Checklist[]>;

  private routerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private checklistsService: ChecklistsService) { }

  ngOnInit() {
    this.tags = this.tagsService.observePublicTags();

    this.routerSubscription = Observable.combineLatest(
      this.route.data,
      this.route.params
    )
      .subscribe((value) => {
        const data = value[0];
        const featured: boolean = data['featured'];
        if (featured) {
          this.checklists = this.checklistsService.observeFeaturedChecklists();
          return;
        }
        const params = value[1];
        const tag = params['tag'];
        this.checklists = this.checklistsService.observePublicChecklists(tag);
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
