import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Checklist } from './checklist.model';
import * as firebase from 'firebase';
import * as consts from './firebase.consts';
import { ChecklistService } from './checklist.service';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';

@Injectable()
export class ChecklistsService {

  constructor(
    private firestore: AngularFirestore,
    private checklistService: ChecklistService
  ) { }

  observePublicChecklists(tag: string | null): Observable<Checklist[]> {
    return this.firestore
      .collection(consts.CHECKLISTS_COLLECTION, ref => {
        let query = ref.where('public', '==', true);
        query = tag ? query.where(`tags.${tag}`, '==', true) : query;
        return query;
      })
      .snapshotChanges()
      .distinctUntilChanged()
      .map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data();
          const tags = Object.keys(data['tags']);
          return new Checklist(id, data['title'], data['description'], tags, null);
        });
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
      .flatMap(ids => {
        const checklistsObservables = ids.map(id => {
          return this.checklistService.observeChecklist(id, false)
            .catch(_ => Observable.of(null));
        });

        return Observable.combineLatest(checklistsObservables)
          .map(results => results.filter(result => result != null));
      });

  }

}
