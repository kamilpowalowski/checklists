import {
  Component,
  Input,
  OnDestroy,
  OnInit
  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { ShareModalComponent } from '../../../modals/share-modal/share-modal.component';
import { Checklist } from '../../../shared/checklist.model';
import { UserService } from './../../../shared/user.service';

@Component({
  selector: 'app-checklist-actions',
  templateUrl: './checklist-actions.component.html',
  styleUrls: ['./checklist-actions.component.scss']
})
export class ChecklistActionsComponent implements OnInit, OnDestroy {

  @Input() checklist: Checklist;

  userName = 'Loading...';
  userPhoto: string;

  private userSubscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userSubscription = this.userService.observeUser(this.checklist.owner)
      .subscribe(user => {
        this.userName = user.shortDisplayName();
        this.userPhoto = user.photo;
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  share() {
    const activeModal = this.modalService.open(ShareModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.additionalInfo = this.checklist.isPublic
      ? null
      : 'NOTE: People with URL can access this checklist even if it is not published. Please, share with discretion.';
  }
}
