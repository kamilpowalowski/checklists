import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AccountPersistance } from '../enums/account-persistance.enum';
import { AuthenticationState } from '../enums/authentication-state.enum';
import * as consts from '../firebase.consts';
import { Account } from '../models/account.model';
import { Profile } from '../models/profile.model';
import { User } from '../models/user.model';

@Injectable()
export class AccountService {

  readonly profile = new BehaviorSubject<Profile>(null);
  readonly authenticationState = new BehaviorSubject<AuthenticationState>(AuthenticationState.Unknown);

  constructor(
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth
  ) {
    this.firebaseAuth.authState
      .subscribe(user => {
        this.updateProfile(user);
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
    return this.signInWithProvider(provider);
  }

  signInWithFacebook(): Observable<any> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.signInWithProvider(provider);
  }

  signInWithTwitter(): Observable<any> {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.signInWithProvider(provider);
  }

  signOnWithEmailAndPassword(email: string, password: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
    );
  }

  signOut(): Observable<any> {
    this.updateProfile(null);
    return Observable.fromPromise(
      this.firebaseAuth.auth.signOut()
    );
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.sendPasswordResetEmail(email)
    );
  }

  updateDisplayName(displayName: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.currentUser.updateProfile({
        displayName: displayName,
        photoURL: ''
      })
    ).do(() => {
      this.updateProfile(this.firebaseAuth.auth.currentUser);
    });
  }

  updatePassword(newPassword: string): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.currentUser.updatePassword(newPassword)
    );
  }

  private updateProfile(firebaseUser: firebase.User | null) {
    if (firebaseUser) {
      const account = new Account(
        firebaseUser.uid,
        firebaseUser.email
      );

      const user = new User(
        firebaseUser.uid,
        firebaseUser.displayName,
        firebaseUser.photoURL
      );

      this.saveAccount(account);
      this.saveUser(user);

      this.profile.next(new Profile(account, user));
      this.authenticationState.next(AuthenticationState.Authenticated);
    } else {
      this.profile.next(null);
      this.authenticationState.next(AuthenticationState.Unauthenticated);
    }
  }

  private saveAccount(account: Account) {
    this.firestore
      .collection(consts.ACCOUNTS_COLLECTION)
      .doc(account.id)
      .set({
        'email': account.email
      }, { merge: true });
  }

  private saveUser(user: User) {
    this.firestore
      .collection(consts.USERS_COLLECTION)
      .doc(user.id)
      .set({
        'display-name': user.displayName,
        'photo': user.photo
      }, { merge: true });
  }

  private signInWithProvider(provider: firebase.auth.AuthProvider): Observable<any> {
    return Observable.fromPromise(
      this.firebaseAuth.auth.signInWithRedirect(provider)
    );
  }
}
