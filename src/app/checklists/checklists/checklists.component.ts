import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
  } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Checklist } from './../../shared/checklist.model';
import { ChecklistsService } from './../../shared/checklists.service';
import { TagsService } from './../../shared/tags.service';
import { ChecklistsMenuComponent } from './checklists-menu/checklists-menu.component';
import { ChecklistsTagsComponent } from './checklists-tags/checklists-tags.component';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class ChecklistsComponent implements OnInit, OnDestroy {
  @ViewChild('menuComponent') menuComponent: ChecklistsMenuComponent;
  @ViewChild('tagsComponent') tagsComponent: ChecklistsTagsComponent;

  tags: Observable<string[]>;
  items = [
    {
      title: 'featured',
      link: '/checklists/public/featured',
      pathMatch: 'full'
    }
  ];
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
      .subscribe(value => {
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
