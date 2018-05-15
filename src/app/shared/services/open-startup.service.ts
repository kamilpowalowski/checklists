import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import * as consts from '../firebase.consts';
import { Statistics, StatisticsItem } from './../models/statistics.model';

@Injectable()
export class OpenStartupService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  observeOpenStartupStatistics(): Observable<Statistics> {
    return this.firestore
      .collection(consts.STATS_COLLECTION)
      .doc('values')
      .valueChanges()
      .map(data => {
        const users: { date: firebase.firestore.Timestamp, value: number }[] = data['users-daily'];
        const usersItems: StatisticsItem[] = users
          .map(element => new StatisticsItem(element.date.toDate(), element.value));

        const checklists: { date: firebase.firestore.Timestamp, value: number }[] = data['checklists-daily'];
        const checklistsItems: StatisticsItem[] = checklists
          .map(element => new StatisticsItem(element.date.toDate(), element.value));

        return new Statistics(usersItems, checklistsItems);
      });
  }
}
