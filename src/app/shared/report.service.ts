import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AccountService } from './account.service';
import { Checklist } from './checklist.model';
import * as consts from './firebase.consts';

@Injectable()
export class ReportService {

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService
  ) { }

  reportChecklist(checklist: Checklist) {
    this.firestore
      .collection(consts.REPORTED_COLLECTION)
      .add({
        'reporter': this.accountService.profile.getValue().account.id,
        'email': this.accountService.profile.getValue().account.email,
        'checklist': checklist.id
      });
  }

}
