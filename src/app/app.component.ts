import { Component, OnInit, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { CookieLawService } from 'angular2-cookie-law';
import * as EmojiOne from 'emojione';
import { AccountService } from './shared/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showCookieLaw: boolean;

  constructor(
    private themeService: NbThemeService,
    private cookieLawService: CookieLawService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    EmojiOne.emojiSize = '64';
    this.showCookieLaw = !this.cookieLawService.seen();

    const currentThemeName = window.localStorage.getItem('selected-theme');
    this.themeService.changeTheme(currentThemeName ? currentThemeName : 'default');
  }
}
