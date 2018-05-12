import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/mergeMapTo';
import { Observable } from 'rxjs/Observable';
import { ModalComponent } from '../../modals/modal/modal.component';
import { Checklist } from '../../shared/models/checklist.model';
import { AccountService } from '../../shared/services/account.service';
import { ChecklistsService } from '../../shared/services/checklists.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  publicChecklists: Observable<Checklist[]>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private accountService: AccountService,
    private checklistsService: ChecklistsService
  ) { }

  ngOnInit() {
    this.publicChecklists = this.checklistsService.observeAccountChecklists(null, true);
  }

  delete() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Delete account?';
    activeModal.componentInstance.body = `
    It's sad that you already want to leave.<br/>
    All your data - created and saved checklists,
    selected checkboxes and personal info (email address, username and avatar)
    will be deleted and can't be recovered.<br/>
    Deleting account process is done manually and may take 24 hours.<br/>
    Do you still want to delete your account?
    `;
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.destructiveButtonTitle = 'Delete';
    activeModal.componentInstance.destructiveButtonAction = () => {
      activeModal.close();
      this.deleteAccount();
    };
  }

  private deleteAccount() {
    this.accountService.removeAccount()
      .subscribe(_ => {
        this.router.navigate(['/home']);
      }, error => {
        console.log(error);
        const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
        activeModal.componentInstance.title = 'Error occured';
        activeModal.componentInstance.body = `
        An error occured: "${error}".
        `;
        activeModal.componentInstance.primaryButtonTitle = 'OK';
        activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
      });
  }
}
