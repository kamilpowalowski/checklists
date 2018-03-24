import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChildren
  } from '@angular/core';
import { Router } from '@angular/router';
import { NbPopoverDirective } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { ShareModalComponent } from '../../../modals/share-modal/share-modal.component';
import { AccountService } from '../../../shared/account.service';
import { AuthenticationState } from '../../../shared/authentication-state.enum';
import { Checklist } from '../../../shared/checklist.model';
import { SaveService } from '../../../shared/save.service';
import { UserService } from '../../../shared/user.service';
import { ModalComponent } from './../../../modals/modal/modal.component';
import { ReportService } from './../../../shared/report.service';

@Component({
  selector: 'app-checklist-actions',
  templateUrl: './checklist-actions.component.html',
  styleUrls: ['./checklist-actions.component.scss']
})
export class ChecklistActionsComponent implements OnInit, OnDestroy {

  @Input() checklist: Checklist;
  @ViewChildren(NbPopoverDirective) popoverDirectives;

  userName = 'Loading...';
  userPhoto: string;

  isAuthenticated = false;
  isSaved = false;

  private userSubscription: Subscription;
  private authenticatedSubscription: Subscription;
  private savedIdsSubscription: Subscription;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private accountSerivce: AccountService,
    private userService: UserService,
    private saveService: SaveService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.userSubscription = this.userService.observeUser(this.checklist.owner)
      .subscribe(user => {
        this.userName = user.shortDisplayName();
        this.userPhoto = user.photo;
      });

    this.authenticatedSubscription = this.accountSerivce.authenticationState
      .map(state => state === AuthenticationState.Authenticated)
      .subscribe(authenticated => {
        this.savedIdsSubscription = this.saveService.savedIds
          .subscribe(_ => {
            this.isSaved = this.saveService.isChecklistSaved(this.checklist);
          });
        this.isAuthenticated = authenticated;
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.authenticatedSubscription.unsubscribe();
    if (this.savedIdsSubscription) {
      this.savedIdsSubscription.unsubscribe();
    }
  }

  share() {
    const activeModal = this.modalService.open(ShareModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.additionalInfo = this.checklist.isPublic
      ? null
      : 'NOTE: People with URL can access this checklist even if it is not published. Please, share with discretion.';
  }

  save() {
    this.popoverDirectives
      .filter(popoverDirective => popoverDirective.isShown)
      .forEach(popoverDirective => popoverDirective.hide());
    this.saveService.saveChecklist(this.checklist);
  }

  unsave() {
    this.popoverDirectives
      .filter(popoverDirective => popoverDirective.isShown)
      .forEach(popoverDirective => popoverDirective.hide());
    this.saveService.unsaveChecklist(this.checklist);
  }

  reportPopover() {
    if (!this.checklist.isPublic) { return 'You can\'t report not public checklist'; }
    if (!this.isAuthenticated) { return 'Log in to use this feature.'; }
    return 'Report this checklist.';
  }

  reportDisabled() {
    if (!this.checklist.isPublic) { return true; }
    if (!this.isAuthenticated) { return true; }
    return false;
  }

  report() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Report this checklist?';
    activeModal.componentInstance.body = `
    This checklist will be checked and unpublish if necessary.
    We may contact you for further information.
    Do you want to report this checklist?
    `;
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.destructiveButtonTitle = 'Report';
    activeModal.componentInstance.destructiveButtonAction = () => {
      activeModal.close();
      this.reportService.reportChecklist(this.checklist);
      this.checklistReportedConfirmation();
    };
  }

  private checklistReportedConfirmation() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Checklist reported';
    activeModal.componentInstance.body = `
    Thank you for your contribution. We'll check this checklists as soon as possible.
    `;
    activeModal.componentInstance.primaryButtonTitle = 'OK';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
  }
}
