import { Component, OnInit } from '@angular/core';
import { BodyOutputType, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  toasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    timeout: 10000,
    newestOnTop: true,
    tapToDismiss: true,
    preventDuplicates: true,
    showCloseButton: true,
    animation: 'fade',
    bodyOutputType: BodyOutputType.Default,
    limit: 5,
  });

  constructor() { }

  ngOnInit() {
  }

}
