import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { ChecklistItem } from './checklist-item.model';
import { Checklist } from './checklist.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import * as consts from './firebase.consts';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class ChecklistService {

  readonly selectedIds = new BehaviorSubject<Set<string>>(new Set());

  private selectedIdsReference: AngularFirestoreDocument<{ [key: string]: firebase.firestore.FieldValue }>;
  private selectedIdsSubscription: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService
  ) {
    this.accountService.account.asObservable()
      .subscribe((account) => {
        this.resetSelectedIds();
        if (account != null) {
          this.observeSelectedIds(account);
        }
      });
  }

  getChecklist(id: string): Observable<Checklist> {
    const checklistReference = this.firestore
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc<Checklist>(id);
    return checklistReference.valueChanges()
      .map(data => {
        const itemsReference = checklistReference
          .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);
        const items = this.checklistItems(itemsReference);
        const checklist = new Checklist(id, data['title'], data['description'], items);
        return checklist;
      });
  }

  markAsSelected(item: ChecklistItem) {
    if (item.items.getValue().length === 0) {
      this.selectedIdsReference
        .set({ [item.id]: true }, { merge: true });
    } else {
      for (const subItem of item.items.getValue()) {
        this.markAsSelected(subItem);
      }
    }
  }

  markAsUnselected(item: ChecklistItem) {
    if (item.items.getValue().length === 0) {
      this.selectedIdsReference
        .set({ [item.id]: firebase.firestore.FieldValue.delete() }, { merge: true });
    } else {
      for (const subItem of item.items.getValue()) {
        this.markAsUnselected(subItem);
      }
    }
  }

  isChecklistItemSelected(item: ChecklistItem): boolean {
    if (item.items.getValue().length === 0) {
      return this.selectedIds.getValue().has(item.id);
    }
    for (const subItem of item.items.getValue()) {
      if (this.isChecklistItemSelected(subItem) === false) {
        return false;
      }
    }
    return true;
  }

  private checklistItems(reference: AngularFirestoreCollection<ChecklistItem>): Observable<ChecklistItem[]> {
    return reference.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          const itemsReference = reference
            .doc(id)
            .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);
          const items = this.checklistItems(itemsReference);
          return new ChecklistItem(id, data['order'], data['title'], data['description'], items);
        });
      });
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
      .filter(data => data != null)
      .subscribe((data) => {
        const selectedIdsSet = new Set(Object.keys(data));
        this.selectedIds.next(selectedIdsSet);
      });
  }
}
