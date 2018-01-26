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
import { AuthenticationMethod } from '../../shared/authentication-method.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  method = AuthenticationMethod;

  redirectDelay = 0;
  showMessages: any = {};
  provider = '';

  errors: string[] = [];
  messages: string[] = [];
  data: any = { rememberMe: true };
  submitted = false;

  constructor(
    private authService: NbAuthService,
    @Inject(NB_AUTH_OPTIONS_TOKEN) private config = {},
    private router: Router
  ) { }

  ngOnInit() {
    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');

    this.submitted = true;
    this.data.method = AuthenticationMethod.Redirect;
    this.authService
      .authenticate(this.provider, this.data)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;

        if (result.isSuccess()) {
          this.messages = result.getMessages();
        }

        const redirect = result.getRedirect();
        if (redirect) {
          this.router.navigateByUrl(redirect);
        }
      });
  }

  login(method: AuthenticationMethod) {
    this.errors = this.messages = [];
    this.submitted = true;
    this.data.method = method;

    this.authService
      .authenticate(this.provider, this.data)
      .subscribe((result: NbAuthResult) => {
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
