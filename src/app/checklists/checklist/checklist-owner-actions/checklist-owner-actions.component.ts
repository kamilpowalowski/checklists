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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    // TODO: Implement
  }

  unpublish() {
    // TODO: Implement
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
    activeModal.componentInstance.body = 'This operation can\'t be reversed. Do you really want to delete this checklist?';
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.destructiveButtonTitle = 'Delete';
    activeModal.componentInstance.destructiveButtonAction = () => {
      this.checklistService.removeChecklist(this.checklist)
        .subscribe(
          _ => {
            this.router.navigate(['checklists', 'me', 'all']);
            activeModal.close();
          },
          error => {
            ModalComponent.showModalError(this.modalService, error);
          });
    };
  }

}
