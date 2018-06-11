import { Injectable } from '@angular/core';
import { FusejsService } from 'angular-fusejs';
import { Observable } from 'rxjs';
import { SearchScope } from './../enums/search-scope.enum';
import { Checklist } from './../models/checklist.model';
import { ChecklistsService } from './checklists.service';
import { SaveService } from './save.service';

@Injectable()
export class SearchService {

  constructor(
    private fusejsService: FusejsService,
    private checklistsService: ChecklistsService,
    private saveService: SaveService
  ) { }

  searchChecklists(scope: SearchScope, query: string): Observable<Checklist[]> {
    switch (scope) {
      case SearchScope.Public: {
        return this.publicChecklists(query);
      }
      case SearchScope.Own: {
        return this.ownChecklists(query);
      }
      case SearchScope.Saved: {
        return this.savedChecklists(query);
      }
    }
  }

  private publicChecklists(query: string): Observable<Checklist[]> {
    return this.checklistsService.observePublicChecklists(null)
      .map(checklists => this.filterChecklists(checklists, query));
  }

  private ownChecklists(query: string): Observable<Checklist[]> {
    return this.checklistsService.observeAccountChecklists(null, false)
      .map(checklists => this.filterChecklists(checklists, query));
  }

  private savedChecklists(query: string): Observable<Checklist[]> {
    return this.saveService.observeSavedChecklists()
      .map(checklists => this.filterChecklists(checklists, query));
  }

  private filterChecklists(checklists: Checklist[], query: string): Checklist[] {
    return this.fusejsService.searchList(checklists, query, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      keys: ['title', 'description', 'tags'],
      maxPatternLength: 32,
      minMatchCharLength: 2
    });
  }
}
