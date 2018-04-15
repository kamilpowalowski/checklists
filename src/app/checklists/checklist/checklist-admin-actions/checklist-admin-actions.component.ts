import { Component, Input, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { ModalComponent } from '../../../modals/modal/modal.component';
import { Checklist } from '../../../shared/models/checklist.model';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-checklist-admin-actions',
  templateUrl: './checklist-admin-actions.component.html',
  styleUrls: ['./checklist-admin-actions.component.scss']
})
export class ChecklistAdminActionsComponent implements OnInit, OnDestroy {

  @Input() checklist: Checklist;
  isFeatured: boolean;

  private featuredSubscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.featuredSubscription = this.adminService.isChecklistFeatured(this.checklist)
      .subscribe(featured => this.isFeatured = featured);
  }

  ngOnDestroy() {
    this.featuredSubscription.unsubscribe();
  }

  feature() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Feature checklist?';
    activeModal.componentInstance.body = `
    Checklist will be exposed on home screen and list of featured in Public Checklist section.
    Do you want to feature this checklist?
    `;
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.successButtonTitle = 'Feature';
    activeModal.componentInstance.successButtonAction = () => {
      activeModal.close();
      this.adminService.featureChecklist(this.checklist);
    };
  }

  unfeature() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Un-feature checklist?';
    activeModal.componentInstance.body = `
  Checklist will be removed from list on home screen and list of featured in Public Checklist section.
  Do you want to un-feature this checklist?
  `;
    activeModal.componentInstance.primaryButtonTitle = 'Cancel';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
    activeModal.componentInstance.successButtonTitle = 'Un-feature';
    activeModal.componentInstance.successButtonAction = () => {
      activeModal.close();
      this.adminService.unfeatureChecklist(this.checklist);
    };
  }
}
