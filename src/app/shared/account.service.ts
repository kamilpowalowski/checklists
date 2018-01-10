import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from './account.model';
import * as consts from './firebase.consts';

@Injectable()
export class AccountService {

  readonly account = new BehaviorSubject<Account>(null);

  constructor(
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth
  ) {
    this.firebaseAuth.authState
      .subscribe(user => {
        if (user) {
          const account = new Account(user.uid, user.isAnonymous);
          this.saveAccount(account);
          this.account.next(account);
        } else {
          this.account.next(null);
        }
      });
  }

  signInAnonymously() {
    this.firebaseAuth.auth.signInAnonymously();
  }

  private saveAccount(account: Account) {
    this.firestore
      .collection(consts.USERS_COLLECTION)
      .doc(account.id)
      .set({ anonymous: account.anonymous }, { merge: true });
  }

}
