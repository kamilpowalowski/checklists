import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { NbMenuItem } from '@nebular/theme';
import { Observable, Subscription } from 'rxjs';
import { SearchScope } from '../../shared/enums/search-scope.enum';
import { Checklist } from '../../shared/models/checklist.model';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-checklists-search',
  templateUrl: './checklists-search.component.html',
  styleUrls: ['./checklists-search.component.scss']
})
export class ChecklistsSearchComponent implements OnInit, OnDestroy {

  title: string;
  items: NbMenuItem[];
  checklists: Observable<Checklist[]>;

  private routerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    const queryObservable: Observable<string> = this.route.params
      .map(params => params['query'])
      .do(query => this.generateMenuItemsForQuery(query));

    const scopeObservable: Observable<SearchScope> = this.route.data
      .map(data => data['scope']);

    this.routerSubscription = Observable.combineLatest(scopeObservable, queryObservable)
      .subscribe(values => {
        this.checklists = this.searchService.searchChecklists(values[0], values[1]);
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  private generateMenuItemsForQuery(query: string) {
    this.title = `Search results for '${query}'`;
    this.items = [
      {
        title: 'public',
        icon: 'nb-cloudy',
        link: `/checklists/search/public/${query}`
      },
      {
        title: 'my',
        icon: 'nb-star',
        link: `/checklists/search/me/${query}`
      },
      {
        title: 'saved',
        icon: 'nb-heart',
        link: `/checklists/search/saved/${query}`
      }
    ];
  }

}
