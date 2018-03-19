import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChildren
  } from '@angular/core';
import { Router } from '@angular/router';
import { NbPopoverDirective } from '@nebular/theme';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../modals/modal/modal.component';
import { Checklist } from '../../../shared/checklist.model';
import { ChecklistService } from '../../../shared/checklist.service';
import { ShareModalComponent } from './../../../modals/share-modal/share-modal.component';

@Component({
  selector: 'app-checklist-owner-actions',
  templateUrl: './checklist-owner-actions.component.html',
  styleUrls: ['./checklist-owner-actions.component.scss']
})
export class ChecklistOwnerActionsComponent implements OnInit, OnDestroy {

  @Input() checklist: Checklist;
  @ViewChildren(NbPopoverDirective) popoverDirectives;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private checklistService: ChecklistService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.popoverDirectives
      .filter(popoverDirective => popoverDirective.isShown)
      .forEach(popoverDirective => popoverDirective.hide());
  }

  edit() {
    this.router.navigate(
      ['/checklists', 'edit', this.checklist.id],
      { queryParams: { 'return-url': this.router.url } }
    );
  }

  publish() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Publish checklist?';
    activeModal.componentInstance.body = `
    A public checklist can be searched and viewed by other users.
    Do you want to publish your checklist?
    `;
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.successButtonTitle = 'Publish';
    activeModal.componentInstance.successButtonAction = () => {
      activeModal.close();
      this.changeChecklistPublicState(true);
    };
  }

  unpublish() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Unpublish checklist?';
    activeModal.componentInstance.body = `
    Users that already have URL or saved this checklist still be able to view it.
    This checklist will not be visible on a search result and public lists.
    Do you want to unpublish this checklist?
    `;
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.successButtonTitle = 'Unpublish';
    activeModal.componentInstance.successButtonAction = () => {
      activeModal.close();
      this.changeChecklistPublicState(false);
    };
  }

  share() {
    const activeModal = this.modalService.open(ShareModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.additionalInfo = this.checklist.isPublic
      ? null
      : 'NOTE: People with URL can access this checklist even if it is not published. Please, share with discretion.';
  }

  delete() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Delete checklist?';
    activeModal.componentInstance.body = 'This operation can\'t be reversed. Do you really want to delete your checklist?';
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.destructiveButtonTitle = 'Delete';
    activeModal.componentInstance.destructiveButtonAction = () => {
      this.deleteChecklist(activeModal);
    };
  }

  private deleteChecklist(activeModal: NgbModalRef) {
    this.checklistService.removeChecklist(this.checklist)
      .subscribe(
        _ => {
          this.router.navigate(['checklists', 'me', 'all']);
          activeModal.close();
        },
        error => {
          activeModal.close();
          ModalComponent.showModalError(this.modalService, error);
        });
  }

  private changeChecklistPublicState(state: boolean) {
    this.checklistService.changeChecklistPublicState(this.checklist, state)
      .subscribe(
        null,
        error => {
          ModalComponent.showModalError(this.modalService, error);
        });
  }

}
