import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { Checklist } from './checklist.model';
import { ChecklistService } from './checklist.service';
import * as consts from './firebase.consts';

@Injectable()
export class ChecklistsService {

  constructor(
    private firestore: AngularFirestore,
    private checklistService: ChecklistService,
    private accountService: AccountService
  ) { }

  observePublicChecklists(tag: string | null): Observable<Checklist[]> {
    return this.observeChecklists(ref => {
      let query = ref.where('public', '==', true);
      query = tag ? query.where(`tags.${tag}`, '==', true) : query;
      return query;
    });
  }

  observeFeaturedChecklists(): Observable<Checklist[]> {
    return this.firestore
      .collection(consts.FEATURED_COLLECTION)
      .snapshotChanges()
      .distinctUntilChanged()
      .map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
      .mergeMap(ids => {
        const checklistsObservables = ids.map(id => {
          return this.checklistService.observeChecklist(id, false)
            .catch(_ => Observable.of(null));
        });

        if (checklistsObservables.length === 0) {
          return Observable.of([]);
        }

        return Observable.combineLatest(checklistsObservables)
          .map(results => results.filter(result => result != null));
      });
  }

  observeAccountChecklists(tag: string | null, onlyPublic: boolean): Observable<Checklist[]> {
    const accountId = this.accountService.profile.getValue().account.id;
    return this.observeChecklists(ref => {
      let query = ref.where('owner', '==', accountId);
      query = onlyPublic ? query.where('public', '==', true) : query;
      query = tag ? query.where(`tags.${tag}`, '==', true) : query;
      return query;
    });
  }

  private observeChecklists(queryFn?: QueryFn): Observable<Checklist[]> {
    return this.firestore
      .collection(consts.CHECKLISTS_COLLECTION, queryFn)
      .snapshotChanges()
      .distinctUntilChanged()
      .map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data();
          const tags = Object.keys(data['tags']);
          return new Checklist(
            id, data['owner'], data['title'], data['description'],
            tags, data['public'], null
          );
        });
      });
  }

}
