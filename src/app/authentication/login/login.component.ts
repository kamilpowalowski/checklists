import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFacebook, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from '@nebular/auth/helpers';
import 'rxjs/add/operator/take';
import { AuthenticationMethod } from '../../shared/enums/authentication-method.enum';

/**
 * Based on nebular NbLoginComponent
 * https://github.com/akveo/nebular
 *
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */


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

  googleIcon = faGoogle;
  facebookIcon = faFacebook;
  twitterIcon = faTwitter;

  returnUrl: string;

  constructor(
    private authService: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) private config = {},
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['return-url'];

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');

    this.submitted = true;
    this.data.method = AuthenticationMethod.CheckState;
    this.authService
      .authenticate(this.provider, this.data)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;

        if (result.isSuccess()) {
          this.messages = result.getMessages();
        }

        const redirect = result.getRedirect();
        if (redirect) {
          this.router.navigateByUrl(this.returnUrl ? this.returnUrl : redirect);
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
            return this.router.navigateByUrl(this.returnUrl ? this.returnUrl : redirect);
          }, this.redirectDelay);
        }
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
