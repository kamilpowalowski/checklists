import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as consts from '../firebase.consts';
import { Checklist } from '../models/checklist.model';
import { AccountService } from './account.service';

@Injectable()
export class AdminService {

  private adminIds = new Set<string>();

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService
  ) {
    this.observeAdminIds();
  }

  isUserAnAdmin(): Observable<boolean> {
    return this.accountService.profile
      .map(profile => {
        if (!profile) { return false; }
        return this.adminIds.has(profile.account.id);
      });
  }

  featureChecklist(checklist: Checklist) {
    this.firestore.collection(consts.FEATURED_COLLECTION)
      .doc(checklist.id)
      .set({
        'date': firebase.firestore.FieldValue.serverTimestamp(),
        'admin': this.accountService.profile.getValue().account.id
      });
  }

  unfeatureChecklist(checklist: Checklist) {
    this.firestore.collection(consts.FEATURED_COLLECTION)
      .doc(checklist.id)
      .delete();
  }

  isChecklistFeatured(checklist: Checklist): Observable<boolean> {
    return this.firestore.collection(consts.FEATURED_COLLECTION)
      .doc(checklist.id)
      .valueChanges()
      .map(data => data !== null);
  }

  private observeAdminIds() {
    this.firestore
      .collection(consts.ADMINS_COLLECTION)
      .snapshotChanges()
      .take(1)
      .map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
      .subscribe(ids => {
        this.adminIds = new Set(ids);
      });
  }

}
