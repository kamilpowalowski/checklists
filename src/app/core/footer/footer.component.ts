import { Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { versionLong } from '../../../_versions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  versionCode = versionLong;
  githubIcon = faGithub;

  constructor() { }

  ngOnInit() {
  }

}
