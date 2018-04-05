import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as consts from '../firebase.consts';
import { SAVED_COLLECTION } from '../firebase.consts';
import { Account } from '../models/account.model';
import { Checklist } from '../models/checklist.model';
import { AccountService } from './account.service';
import { ChecklistService } from './checklist.service';

@Injectable()
export class SaveService {

  readonly savedIds = new BehaviorSubject<Set<string>>(new Set());

  private savedIdsReference: AngularFirestoreDocument<{ [key: string]: firebase.firestore.FieldValue }>;
  private savedIdsSubscription: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService,
    private checklistService: ChecklistService
  ) {
    this.accountService.profile.asObservable()
      .subscribe(profile => {
        this.resetSavedIds();
        if (profile) {
          this.observeSavedIds(profile.account);
        }
      });
  }

  observeSavedChecklists(): Observable<Checklist[]> {
    const accountId = this.accountService.profile.getValue().account.id;

    return this.firestore
      .collection(consts.SAVED_COLLECTION)
      .doc<{ [key: string]: boolean }>(accountId)
      .valueChanges()
      .distinctUntilChanged()
      .map(data => {
        if (data === null) { return []; }
        return Object.keys(data);
      })
      .mergeMap(ids => {
        if (ids.length === 0) { return Observable.of([]); }

        const checklistsObservables = ids.map(id => {
          return this.checklistService.observeChecklist(id, false)
            .catch(_ => Observable.of(null));
        });

        return Observable.combineLatest(checklistsObservables)
          .map(results => results.filter(result => result != null));
      });
  }

  saveChecklist(checklist: Checklist) {
    this.savedIdsReference
      .set({ [checklist.id]: true }, { merge: true });
  }

  unsaveChecklist(checklist: Checklist) {
    this.savedIdsReference
      .set({ [checklist.id]: firebase.firestore.FieldValue.delete() }, { merge: true });
  }

  isChecklistSaved(checklist: Checklist): boolean {
    return this.savedIds.getValue().has(checklist.id);
  }

  private resetSavedIds() {
    if (this.savedIdsSubscription) {
      this.savedIdsSubscription.unsubscribe();
    }
    this.savedIds.next(new Set());
  }

  private observeSavedIds(account: Account) {
    this.savedIdsReference = this.firestore
      .collection(consts.SAVED_COLLECTION)
      .doc<{ [key: string]: firebase.firestore.FieldValue }>(account.id);

    this.savedIdsSubscription = this.savedIdsReference
      .valueChanges()
      .distinctUntilChanged()
      .filter(data => data != null)
      .subscribe(data => {
        const savedIdsSet = new Set(Object.keys(data));
        this.savedIds.next(savedIdsSet);
      });
  }

}
