import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Account } from './account.model';
import { AccountService } from './account.service';
import { Checklist } from './checklist.model';
import { SAVED_COLLECTION } from './firebase.consts';
import * as consts from './firebase.consts';

@Injectable()
export class SaveService {

  readonly savedIds = new BehaviorSubject<Set<string>>(new Set());

  private savedIdsReference: AngularFirestoreDocument<{ [key: string]: firebase.firestore.FieldValue }>;
  private savedIdsSubscription: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService
  ) {
    this.accountService.account.asObservable()
      .subscribe(account => {
        this.resetSavedIds();
        if (account) {
          this.observeSavedIds(account);
        }
      });
  }

  savedChecklists(): Observable<[Checklist]> {
    // TODO: implement
    return null;
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
      .doc<{ [key: string]: boolean }>(account.id);

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
