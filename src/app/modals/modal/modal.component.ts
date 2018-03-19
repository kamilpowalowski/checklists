import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  title: string;
  body: string;
  primaryButtonTitle: string;
  successButtonTitle: string;
  destructiveButtonTitle: string;

  primaryButtonAction: () => void;
  successButtonAction: () => void;
  destructiveButtonAction: () => void;

  constructor(private activeModal: NgbActiveModal) { }

  static showModalError(modalService: NgbModal, error: any) {
    const activeModal = modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.title = 'Houston, we have a problem';
    activeModal.componentInstance.body = error;
    activeModal.componentInstance.primaryButtonTitle = 'OK';
    activeModal.componentInstance.primaryButtonAction = () => activeModal.close();
  }

  ngOnInit() { }

  closeModal() {
    this.activeModal.close();
  }

}
