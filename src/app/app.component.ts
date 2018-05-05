import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
  } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as EmojiOne from 'emojione';
import { NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent/event';
import { NgcCookieConsentService } from 'ngx-cookieconsent/service';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from './shared/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private statusChangeSubscription: Subscription;

  constructor(
    private themeService: NbThemeService,
    private cookieConsentService: NgcCookieConsentService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    EmojiOne.emojiSize = '64';

    const currentThemeName = window.localStorage.getItem('selected-theme');
    this.themeService.changeTheme(currentThemeName ? currentThemeName : 'default');

    if (!window.localStorage.getItem('cookie-consent-presented')) {
      this.cookieConsentService.open();
    }

    this.statusChangeSubscription = this.cookieConsentService.statusChange$
      .subscribe((event: NgcStatusChangeEvent) => {
        window.localStorage.setItem('cookie-consent-presented', 'true');
      });
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }
}
