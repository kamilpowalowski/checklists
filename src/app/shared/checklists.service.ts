import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Checklist } from './checklist.model';
import * as firebase from 'firebase';
import * as consts from './firebase.consts';

@Injectable()
export class ChecklistsService {

  constructor(private firestore: AngularFirestore) { }

  observePublicChecklists(tag: string | null): Observable<Checklist[]> {
    return this.firestore
      .collection(consts.CHECKLISTS_COLLECTION, ref => {
        let query = ref.where('public', '==', true);
        query = tag ? query.where(`tags.${tag}`, '==', true) : query;
        return query;
      })
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data();
          const tags = Object.keys(data['tags']);
          return new Checklist(id, data['title'], data['description'], tags, null);
        });
      });
  }

}
