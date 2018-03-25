import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as EmojiOne from 'emojione';
import { AccountService } from './shared/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private themeService: NbThemeService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    EmojiOne.emojiSize = '64';

    const currentThemeName = window.localStorage.getItem('selected-theme');
    this.themeService.changeTheme(currentThemeName ? currentThemeName : 'default');
  }
}
