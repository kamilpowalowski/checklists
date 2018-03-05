import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/operator/distinctUntilChanged';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Account } from './account.model';
import { AccountService } from './account.service';
import { ChecklistItem } from './checklist-item.model';
import { Checklist } from './checklist.model';
import * as consts from './firebase.consts';


@Injectable()
export class ChecklistService {

  readonly selectedIds = new BehaviorSubject<Set<string>>(new Set());

  private selectedIdsReference: AngularFirestoreDocument<{ [key: string]: firebase.firestore.FieldValue }>;
  private selectedIdsSubscription: Subscription;

  constructor(private firestore: AngularFirestore, private accountService: AccountService) {
    this.accountService.account.asObservable()
      .subscribe(account => {
        this.resetSelectedIds();
        if (account) {
          this.observeSelectedIds(account);
        }
      });
  }

  observeChecklist(id: string, fullData: boolean): Observable<Checklist> {
    const checklistReference = this.firestore
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc<Checklist>(id);

    return checklistReference
      .valueChanges()
      .distinctUntilChanged()
      .map(data => {
        const tags = Object.keys(data['tags']);
        const itemsReference = checklistReference
          .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);
        const items = fullData ? this.checklistItems(itemsReference) : null;
        return new Checklist(id, data['title'], data['description'], tags, data['public'], items);
      });
  }

  selectChecklistItem(item: ChecklistItem) {
    if (item.subitems.length === 0) {
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

  saveChecklist(checklist: Checklist): Observable<string> {
    const checklistReference = this.firestore
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc(checklist.id);

    return this.accountService.account.asObservable()
      .flatMap(account => {
        const addChecklistPromise = checklistReference
          .set(checklist.rawValue(account), { merge: true });
        return Observable.fromPromise(addChecklistPromise);
      })
      .flatMap(_ => {
        const items = checklist.items.getValue();
        if (items.length === 0) { return Observable.of(checklist.id); }

        const itemsReference = checklistReference
          .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);

        return this.checklistItems(itemsReference)
          .take(1)
          .flatMap(oldItems => {
            const batch = this.firestore.firestore.batch();
            this.organizeChecklistItemsBatchOperations(
              batch, itemsReference, oldItems, items
            );

            return Observable.fromPromise(batch.commit());
          })
          .map(_ => checklist.id);
      });
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

  private observeSelectedIds(account: Account) {
    this.selectedIdsReference = this.firestore
      .collection(consts.SELECTED_COLLECTION)
      .doc<{ [key: string]: boolean }>(account.id);

    this.selectedIdsSubscription = this.selectedIdsReference
      .valueChanges()
      .distinctUntilChanged()
      .filter(data => data != null)
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
      batch.set(reference.doc(item.id).ref, item.rawValue(), { merge: true });
    }
  }
}
