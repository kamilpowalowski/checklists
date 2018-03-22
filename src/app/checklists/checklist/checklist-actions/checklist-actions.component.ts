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
import { UserService } from '../../../shared/user.service';
import { SaveService } from './../../../shared/save.service';

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
    private saveService: SaveService
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

  report() {

  }
}
