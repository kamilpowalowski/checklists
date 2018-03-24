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
import { ChecklistsMenuComponent } from '../checklists/checklists-menu/checklists-menu.component';
import { ChecklistsTagsComponent } from '../checklists/checklists-tags/checklists-tags.component';
import { SaveService } from './../../shared/save.service';

@Component({
  selector: 'app-account-checklists',
  templateUrl: './account-checklists.component.html',
  styleUrls: ['./account-checklists.component.scss']
})
export class AccountChecklistsComponent implements OnInit, OnDestroy {

  @ViewChild('menuComponent') menuComponent: ChecklistsMenuComponent;
  @ViewChild('tagsComponent') tagsComponent: ChecklistsTagsComponent;

  tags: Observable<string[]>;
  items = [
    {
      title: 'new checklist',
      icon: 'nb-plus',
      link: '/checklists/edit/new'
    },
    {
      title: 'all',
      icon: 'nb-list',
      link: '/checklists/me/all'
    },
    {
      title: 'published',
      icon: 'nb-cloudy',
      link: '/checklists/me/public'
    },
    {
      title: 'saved',
      icon: 'nb-heart',
      link: '/checklists/me/saved'
    }
  ];
  checklists: Observable<Checklist[]>;

  private routerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private checklistsService: ChecklistsService,
    private saveService: SaveService
  ) { }

  ngOnInit() {
    this.tags = this.tagsService.observeAccountTags();

    this.routerSubscription = Observable.combineLatest(
      this.route.data,
      this.route.params
    )
      .subscribe(value => {
        const data = value[0];
        const saved: boolean = data['saved'];

        if (saved) {
          this.checklists = this.saveService.observeSavedChecklists();
          return;
        }

        const onlyPublic: boolean = data['onlyPublic'];

        const params = value[1];
        const tag = params['tag'];

        this.checklists = this.checklistsService.observeAccountChecklists(tag, onlyPublic);
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
