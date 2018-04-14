import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MetaService } from '@ngx-meta/core';
import { Toast, ToasterService } from 'angular2-toaster';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ChecklistItem } from '../../shared/models/checklist-item.model';
import { Checklist } from '../../shared/models/checklist.model';
import { AccountService } from '../../shared/services/account.service';
import { ChecklistService } from '../../shared/services/checklist.service';
import { AdminService } from './../../shared/services/admin.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit, OnDestroy {

  checklist: Observable<Checklist>;
  items: Observable<ChecklistItem[]>;
  isAdmin: boolean;

  private userNotAvailableWarningPresented = false;
  private checklistSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private metaService: MetaService,
    public accountService: AccountService,
    private checklistService: ChecklistService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        const id = params['id'];
        this.checklist = this.checklistService.observeChecklist(id, true);
        this.items = this.checklist.mergeMap(checklist => checklist.items);
      });

    this.checklistSubscription = this.checklist
      .distinctUntilChanged((lhs, rhs) => lhs.id === rhs.id)
      .subscribe((checklist) => {
        this.metaService.setTitle(`${checklist.title}`);
        this.metaService.setTag('description', checklist.description);
        this.checklistService.observeChecklistSelectedIds(checklist);
      }, (error) => {
        this.router.navigate(['/not-found']);
      });

    this.isAdmin = this.adminService.isUserAnAdmin();
  }

  ngOnDestroy() {
    this.toasterService.clear();
    this.checklistSubscription.unsubscribe();
  }

  checkAccountAndShowMessage() {
    if (!this.userNotAvailableWarningPresented && !this.accountService.profile.getValue()) {
      this.showToast(
        'No account',
        'Selected checkboxes will disappear at the end of this session. Please, log in to save this data.'
      );
    }
  }

  isOwner(checklist: Checklist): boolean {
    const profile = this.accountService.profile.getValue();
    if (profile) {
      return checklist.owner === profile.account.id;
    }
    return false;
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
