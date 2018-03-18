import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Toast, ToasterService } from 'angular2-toaster';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../shared/account.service';
import { ChecklistItem } from '../../shared/checklist-item.model';
import { Checklist } from '../../shared/checklist.model';
import { ChecklistService } from '../../shared/checklist.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit, OnDestroy {

  checklist: Observable<Checklist>;
  items: Observable<ChecklistItem[]>;

  private userNotAvailableWarningPresented = false;

  constructor(
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    public accountService: AccountService,
    private checklistService: ChecklistService
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        const id = params['id'];
        this.checklist = this.checklistService.observeChecklist(id, true);
        this.items = this.checklist.mergeMap(checklist => checklist.items);
      });
  }

  ngOnDestroy() {
    this.toasterService.clear();
  }

  checkAccountAndShowMessage() {
    if (!this.userNotAvailableWarningPresented && !this.accountService.account.getValue()) {
      this.showToast(
        'Not signed in',
        'Selected checkboxes will disappear during page reload. Please, sign in to save this data.'
      );
    }
  }

  private showToast(title: string, body: string) {
    const toast: Toast = {
      type: 'warning',
      title: title,
      body: body
    };

    this.toasterService.popAsync(toast);
    this.userNotAvailableWarningPresented = true;
  }
}
