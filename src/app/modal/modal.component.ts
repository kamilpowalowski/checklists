import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  title: string;
  body: string;
  primaryButtonTitle: string;
  destructiveButtonTitle: string;

  primaryButtonAction: () => void;
  destructiveButtonAction: () => void;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() { }

  closeModal() {
    this.activeModal.close();
  }

}
