import { Injectable } from '@angular/core';
import { ChecklistItem } from './checklist-item.model';
import { Checklist } from './checklist.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import * as consts from './firebase.consts';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class ChecklistService {

  selectedIds = new BehaviorSubject<Set<string>>(new Set());

  constructor(private firestore: AngularFirestore) {
    this.firestore
      .collection(consts.SELECTED_ITEMS_COLLECTION)
      .doc<{ [key: string]: boolean; }>('user_id')
      .valueChanges()
      .distinctUntilChanged()
      .filter(data => data != null)
      .subscribe((data) => {
        const selectedIdsSet = new Set(Object.keys(data));
        this.selectedIds.next(selectedIdsSet);
      });
  }

  getChecklist(id: string): Observable<Checklist> {
    const checklistReference = this.firestore
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc<Checklist>(id);
    return checklistReference.valueChanges()
      .distinctUntilChanged()
      .map(data => {
        const itemsReference = checklistReference
          .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);
        const items = this.checklistItemsForCollectionReference(itemsReference);
        const checklist = new Checklist(id, data['title'], data['description'], items);
        return checklist;
      });
  }

  markAsSelected(item: ChecklistItem) {
    if (item.items.getValue().length === 0) {
      this.firestore
        .collection(consts.SELECTED_ITEMS_COLLECTION)
        .doc('user_id')
        .set({ [item.id]: true }, { merge: true });
    } else {
      for (const subItem of item.items.getValue()) {
        this.markAsSelected(subItem);
      }
    }
  }

  markAsUnselected(item: ChecklistItem) {
    if (item.items.getValue().length === 0) {
      this.firestore
        .collection(consts.SELECTED_ITEMS_COLLECTION)
        .doc('user_id')
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

  private checklistItemsForCollectionReference(reference: AngularFirestoreCollection<ChecklistItem>): Observable<ChecklistItem[]> {
    return reference.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          const itemsReference = reference
            .doc(id)
            .collection<ChecklistItem>(consts.CHECKLISTS_ITEMS_COLLECTION);
          const items = this.checklistItemsForCollectionReference(itemsReference);
          return new ChecklistItem(id, data['order'], data['title'], data['description'], items);
        });
      });
  }
}
