import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import * as consts from './firebase.consts';

@Injectable()
export class TagsService {

  constructor(private firestore: AngularFirestore) { }

  observePublicTags(): Observable<string[]> {
    return this.firestore
      .collection(consts.TAGS_COLLECTION)
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      });
  }

}
