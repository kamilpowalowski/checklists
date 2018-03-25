import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as consts from '../firebase.consts';
import { Checklist } from '../models/checklist.model';
import { AccountService } from './account.service';

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
