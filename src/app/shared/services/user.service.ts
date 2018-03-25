import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as consts from '../firebase.consts';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  observeUser(id: string): Observable<User> {
    const userReference = this.firestore
      .collection(consts.USERS_COLLECTION)
      .doc<User>(id);

    return userReference
      .valueChanges()
      .distinctUntilChanged()
      .filter(value => value != null)
      .map(data => {
        return new User(id, data['display-name'], data['photo']);
      });
  }
}
