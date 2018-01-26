import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from './account.model';
import * as firebase from 'firebase/app';
import * as consts from './firebase.consts';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import { AccountPersistance } from './account-persistance.enum';

@Injectable()
export class AccountService {

  readonly account = new BehaviorSubject<Account>(null);

  constructor(
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth
  ) {
    this.firebaseAuth.authState
      .subscribe(user => {
        this.updateAccount(user);
      });
  }

  setPersistence(persistance: AccountPersistance) {
    switch (persistance) {
      case AccountPersistance.On:
        this.firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        break;
      case AccountPersistance.Off:
        this.firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        break;
    }
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
    );
  }

  signInWithGoogle(): Observable<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return Observable.fromPromise(
      this.firebaseAuth.auth.signInWithRedirect(provider)
    );
  }

  checkSignInRedirectResult(): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.getRedirectResult()
    )
      .map(result => {
        if (result.user) {
          return result;
        } else {
          throw new Error('Redirect result empty');
        }
      });
  }

  signOnWithEmailAndPassword(email: string, password: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
    );
  }

  signOut(): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.signOut()
    );
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.sendPasswordResetEmail(email)
    );
  }

  updateProfile(displayName: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.currentUser.updateProfile({
        displayName: displayName,
        photoURL: ''
      })
    ).do(() => {
      this.updateAccount(this.firebaseAuth.auth.currentUser);
    });
  }

  updatePassword(newPassword: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.currentUser.updatePassword(newPassword)
    );
  }

  private updateAccount(user: firebase.User | null) {
    if (user) {
      const account = new Account(
        user.uid,
        user.isAnonymous,
        user.displayName,
        user.photoURL
      );

      this.saveAccount(account);
      this.account.next(account);
    } else {
      this.account.next(null);
    }
  }

  private saveAccount(account: Account) {
    this.firestore
      .collection(consts.USERS_COLLECTION)
      .doc(account.id)
      .set({
        anonymous: account.anonymous,
        'display-name': account.displayName,
        'photo': account.photo
      }, { merge: true });
  }
}
