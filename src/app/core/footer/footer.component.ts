import { Component, OnInit } from '@angular/core';
import { versionLong } from '../../../_versions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  versionCode = versionLong;

  constructor() { }

  ngOnInit() {
  }

}
