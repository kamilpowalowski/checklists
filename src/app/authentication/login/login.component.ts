/**
 * Based on nebular NbLoginComponent
 * https://github.com/akveo/nebular
 *
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { NbAuthService, NB_AUTH_OPTIONS_TOKEN, NbAuthResult } from '@nebular/auth';
import { Router } from '@angular/router';
import { getDeepFromObject } from '@nebular/auth/helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  redirectDelay = 0;
  showMessages: any = {};
  provider = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted = false;

  constructor(private service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS_TOKEN) private config = {},
    private router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
  }

  ngOnInit() {

  }

  login(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.provider, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }

}
