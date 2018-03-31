import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {

  constructor(private metaService: MetaService) { }

  ngOnInit() {
    this.metaService.setTag('prerender-status-code', '404');
  }

  ngOnDestroy() {
    this.metaService.removeTag('prerender-status-code');
  }

}
