import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as consts from '../firebase.consts';
import { AccountService } from './account.service';

@Injectable()
export class AdminService {

  readonly adminIds = new BehaviorSubject<Set<string>>(new Set());

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService
  ) {
    this.observeAdminIds();
  }

  isUserAnAdmin(): boolean {
    const account = this.accountService.profile.getValue().account;
    if (!account) { return false; }
    return this.adminIds.getValue().has(account.id);
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
        const adminIdsSet = new Set(ids);
        this.adminIds.next(adminIdsSet);
      });
  }

}
