import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ChecklistsService } from './checklists.service';
import * as consts from './firebase.consts';

@Injectable()
export class TagsService {

  constructor(
    private firestore: AngularFirestore,
    private checklistsSerivce: ChecklistsService
  ) { }

  observePublicTags(): Observable<string[]> {
    return this.firestore
      .collection(consts.TAGS_COLLECTION)
      .snapshotChanges()
      .map(actions => {
        return actions
          .map(action => action.payload.doc.id)
          .sort();
      });
  }

  observeAccountTags(): Observable<string[]> {
    return this.checklistsSerivce.observeAccountChecklists(null, false)
      .map(checklists => {
        const nestedTags = checklists
          .map(checklist => checklist.tags);

        const flattenTags = ([] as string[]).concat(...nestedTags);
        return Array.from(new Set(flattenTags)).sort();
      });
  }

}
