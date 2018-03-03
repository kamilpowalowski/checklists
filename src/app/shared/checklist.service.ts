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
        return new Checklist(id, data['title'], data['description'], tags, items);
      });
  }

  selectChecklistItem(item: ChecklistItem) {
    if (item.items.getValue().length === 0) {
      this.selectedIdsReference
        .set({ [item.id]: true }, { merge: true });
    } else {
      for (const subItem of item.items.getValue()) {
        this.selectChecklistItem(subItem);
      }
    }
  }

  unselectChecklistItem(item: ChecklistItem) {
    if (item.items.getValue().length === 0) {
      this.selectedIdsReference
        .set({ [item.id]: firebase.firestore.FieldValue.delete() }, { merge: true });
    } else {
      for (const subItem of item.items.getValue()) {
        this.unselectChecklistItem(subItem);
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

  createNewChecklist(checklist: Checklist): Observable<string> {
    const checklistReference = this.firestore
      .collection(consts.CHECKLISTS_COLLECTION)
      .doc(checklist.id);

    return this.accountService.account.asObservable()
      .flatMap(account => {
        const addChecklistPromise = checklistReference
          .set(this.mapChecklistToFirebaseData(checklist, account, true));
        return Observable.fromPromise(addChecklistPromise);
      })
      .flatMap(_ => {
        const items = checklist.items.getValue();
        if (items.length === 0) { return Observable.of(checklist.id); }

        const itemsReference = checklistReference
          .collection(consts.CHECKLISTS_ITEMS_COLLECTION);

        const streams = items.map(item => {
          return this.createNewChecklistItem(itemsReference, item);
        });

        return Observable
          .combineLatest(streams)
          .map(_ => checklist.id);
      });
  }

  private checklistItems(reference: AngularFirestoreCollection<ChecklistItem>): Observable<ChecklistItem[]> {
    return reference
      .snapshotChanges()
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
      .distinctUntilChanged()
      .filter(data => data != null)
      .subscribe(data => {
        const selectedIdsSet = new Set(Object.keys(data));
        this.selectedIds.next(selectedIdsSet);
      });
  }

  private createNewChecklistItem(
    reference: AngularFirestoreCollection<{ [key: string]: any }>,
    item: ChecklistItem
  ): Observable<void> {

    const addedItemReference = reference.doc(item.id);

    return Observable.fromPromise(
      addedItemReference
        .set(this.mapChecklistItemToFirebaseData(item))
    )
      .flatMap(_ => {
        const subitems = item.items.getValue();
        if (subitems.length === 0) { return Observable.of(null); }

        const subitemsReference = addedItemReference
          .collection(consts.CHECKLISTS_ITEMS_COLLECTION);

        const streams = subitems.map(subitem => {
          return this.createNewChecklistItem(subitemsReference, subitem);
        });

        return Observable
          .combineLatest(streams)
          .map(_ => null);
      });
  }

  private mapChecklistToFirebaseData(checklist: Checklist, account: Account, isNew: boolean): { [key: string]: any } {
    const result = {
      'title': checklist.title,
      'description': checklist.description,
      'owner': account.id,
      'tags': {}
    };

    if (isNew) { result['public'] = false; }

    checklist.tags.forEach(tag => {
      result['tags'][tag] = true;
    });

    return result;
  }

  private mapChecklistItemToFirebaseData(item: ChecklistItem): { [key: string]: any } {
    return {
      'title': item.title,
      'description': item.description,
      'order': item.order
    };
  }
}
