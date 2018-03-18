import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from '@nebular/auth/helpers';

/**
 * Based on nebular NbRegisterComponent
 * https://github.com/akveo/nebular
 *
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  redirectDelay = 0;
  showMessages: any = {};
  provider = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  data: any = {};

  returnUrl: string;

  constructor(private service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) private config = {},
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['return-url'];
    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.provider = this.getConfigValue('forms.register.provider');
  }

  register() {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.register(this.provider, this.data)
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
            return this.router.navigateByUrl(this.returnUrl ? this.returnUrl : redirect);
          }, this.redirectDelay);
        }
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
