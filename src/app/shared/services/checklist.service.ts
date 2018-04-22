import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import * as consts from '../firebase.consts';
import { Account } from '../models/account.model';
import { ChecklistItem } from '../models/checklist-item.model';
import { Checklist } from '../models/checklist.model';
import { AccountService } from './account.service';


@Injectable()
export class ChecklistService {

  readonly selectedIds = new BehaviorSubject<Set<string>>(new Set());

  private selectedIdsReference: AngularFirestoreDocument<{ [key: string]: firebase.firestore.FieldValue }>;
  private selectedIdsSubscription: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService
  ) {
    this.accountService.profile.asObservable()
      .subscribe(profile => {
        if (!profile) { this.resetSelectedIds(); }
      });
  }

  observeChecklist(id: string, fullData: boolean): Observable<Checklist> {
    const checklistReference = this.firestore
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc<Checklist>(id);

    return checklistReference
      .valueChanges()
      .distinctUntilChanged()
      .do((data) => {
        if (data === null) {
          throw new Error('Checklist not found');
        }
      })
      .map(data => {
        const tags = Object.keys(data['tags']);
        const itemsReference = checklistReference
          .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);
        const items = fullData ? this.checklistItems(itemsReference) : null;
        return new Checklist(
          id, data['owner'], data['created'],
          data['title'], data['description'],
          tags, data['public'], items
        );
      });
  }

  observeChecklistSelectedIds(checklist: Checklist) {
    this.resetSelectedIds();
    const profile = this.accountService.profile.getValue();
    if (profile) {
      this.observeSelectedIds(profile.account, checklist);
    }
  }

  selectChecklistItem(item: ChecklistItem) {
    if (item.subitems.length === 0) {
      this.selectedIds.getValue().add(item.id);
      this.selectedIds.next(this.selectedIds.getValue());

      if (!this.selectedIdsReference) { return; }
      this.selectedIdsReference
        .set({ [item.id]: true }, { merge: true });
    } else {
      for (const subitem of item.subitems) {
        this.selectChecklistItem(subitem);
      }
    }
  }

  unselectChecklistItem(item: ChecklistItem) {
    if (item.subitems.length === 0) {
      this.selectedIds.getValue().delete(item.id);
      this.selectedIds.next(this.selectedIds.getValue());

      if (!this.selectedIdsReference) { return; }
      this.selectedIdsReference
        .set({ [item.id]: firebase.firestore.FieldValue.delete() }, { merge: true });
    } else {
      for (const subitem of item.subitems) {
        this.unselectChecklistItem(subitem);
      }
    }
  }

  isChecklistItemSelected(item: ChecklistItem): boolean {
    if (item.subitems.length === 0) {
      return this.selectedIds.getValue().has(item.id);
    }
    for (const subitem of item.subitems) {
      if (this.isChecklistItemSelected(subitem) === false) {
        return false;
      }
    }
    return true;
  }

  storeChecklist(checklist: Checklist): Observable<string> {
    const checklistReference = this.reference(checklist);

    const setChecklistPromise = checklistReference
      .set(checklist.rawValue(), { merge: false });

    return Observable.fromPromise(setChecklistPromise)
      .mergeMap(_ => {
        const items = checklist.items.getValue();
        if (items.length === 0) { return Observable.of(checklist.id); }

        const itemsReference = checklistReference
          .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);

        return this.checklistItems(itemsReference)
          .take(1)
          .mergeMap(oldItems => {
            const batch = this.firestore.firestore.batch();
            this.organizeChecklistItemsBatchOperations(
              batch, itemsReference, oldItems, items
            );

            return Observable.fromPromise(batch.commit());
          })
          .map(_ => checklist.id);
      });
  }

  removeChecklist(checklist: Checklist): Observable<void> {
    const checklistReference = this.reference(checklist);

    const itemsReference = checklistReference
      .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);

    return this.checklistItems(itemsReference)
      .take(1)
      .map(items => items.map(item => item.id))
      .mergeMap(itemIds => {
        const batch = this.firestore.firestore.batch();
        for (const itemId of itemIds) {
          batch.delete(itemsReference.doc(itemId).ref);
        }
        batch.delete(checklistReference.ref);
        return Observable.fromPromise(batch.commit());
      });
  }

  changeChecklistPublicState(checklist: Checklist, isPublic: boolean): Observable<void> {
    return Observable.fromPromise(
      this.reference(checklist)
        .set({ 'public': isPublic }, { merge: true })
    );
  }

  private checklistItems(reference: AngularFirestoreCollection<ChecklistItem>): Observable<ChecklistItem[]> {
    return reference
      .snapshotChanges()
      .map(actions => {
        return actions
          .map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;

            const subitems = this.checklistItemSubitems(data['subitems']);

            return new ChecklistItem(
              id, data['order'], data['title'],
              data['description'], subitems
            );
          })
          .sort(ChecklistItem.sort);
      });
  }

  private checklistItemSubitems(data: any | null): ChecklistItem[] {
    if (!data) { return []; }

    const subitems = [];
    for (const key of Object.keys(data)) {
      const value = data[key];
      const subitem = new ChecklistItem(
        key, value['order'], value['title'],
        value['description'], []
      );
      subitems.push(subitem);
    }

    return subitems.sort(ChecklistItem.sort);
  }

  private resetSelectedIds() {
    if (this.selectedIdsSubscription) {
      this.selectedIdsSubscription.unsubscribe();
    }
    this.selectedIds.next(new Set());
  }

  private observeSelectedIds(account: Account, checklist: Checklist) {
    this.selectedIdsReference = this.firestore
      .collection(consts.SELECTED_COLLECTION)
      .doc(account.id)
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc<{ [key: string]: boolean }>(checklist.id);

    this.selectedIdsSubscription = this.selectedIdsReference
      .valueChanges()
      .filter(data => data != null)
      .take(1)
      .subscribe(data => {
        const selectedIdsSet = new Set(Object.keys(data));
        this.selectedIds.next(selectedIdsSet);
      });
  }

  private organizeChecklistItemsBatchOperations(
    batch: firebase.firestore.WriteBatch,
    reference: AngularFirestoreCollection<any>,
    oldItems: ChecklistItem[],
    newItems: ChecklistItem[]
  ) {
    const oldItemIds = oldItems.map(item => item.id);
    const newItemIds = newItems.map(item => item.id);
    const itemIdsToRemove = oldItemIds.filter(x => !newItemIds.includes(x));

    for (const itemIdToRemove of itemIdsToRemove) {
      batch.delete(reference.doc(itemIdToRemove).ref);
    }

    for (const item of newItems) {
      batch.set(reference.doc(item.id).ref, item.rawValue(), { merge: false });
    }
  }

  private reference(checklist: Checklist): AngularFirestoreDocument<any> {
    return this.firestore
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc(checklist.id);
  }
}
