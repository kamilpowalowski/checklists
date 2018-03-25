import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { NbAbstractAuthProvider, NbAuthResult } from '@nebular/auth';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { AccountPersistance } from '../enums/account-persistance.enum';
import { AuthenticationMethod } from '../enums/authentication-method.enum';
import { AuthenticationState } from '../enums/authentication-state.enum';
import { AccountService } from './account.service';
/**
 * Based on MolochkoVitaly fork of nebular
 * https://github.com/MolochkoVitaly/nebular
 */


@Injectable()
export class FirebaseAuthenticationProvider extends NbAbstractAuthProvider {

  protected defaultConfig = {
    login: {
      redirect: {
        success: '/home',
        failure: null,
      },
    },
    register: {
      redirect: {
        success: '/home',
        failure: null,
      },
    },
    requestPass: {
      redirect: {
        success: '/auth/login',
        failure: null,
      },
    },
    resetPass: {
      redirect: {
        success: '/auth/login',
        failure: '/auth/reset-password',
      },
    },
    logout: {
      redirect: {
        success: '/home',
        failure: null,
      },
    },
  };

  constructor(private accountService: AccountService) {
    super();
  }

  authenticate(data?: any): Observable<NbAuthResult> {
    let signInStream: Observable<any>;

    if (data.method !== AuthenticationMethod.CheckState) {
      this.accountService.setPersistence(data.rememberMe ? AccountPersistance.On : AccountPersistance.Off);
    }

    switch (data.method) {
      case AuthenticationMethod.Email:
        signInStream = this.accountService.signInWithEmailAndPassword(data.email, data.password);
        break;
      case AuthenticationMethod.Google:
        signInStream = this.accountService.signInWithGoogle();
        break;
      case AuthenticationMethod.Facebook:
        signInStream = this.accountService.signInWithFacebook();
        break;
      case AuthenticationMethod.Twitter:
        signInStream = this.accountService.signInWithTwitter();
        break;
      case AuthenticationMethod.CheckState:
        signInStream = this.accountService.authenticationState
          .filter(state => {
            return state !== AuthenticationState.Unknown;
          })
          .map(state => {
            if (state === AuthenticationState.Authenticated) {
              return {};
            }
            throw new Error('Not authenticated');
          });
        break;
    }

    return signInStream
      .map(result => {
        return this.processSuccess(result, this.getConfigValue('login.redirect.success'), [result.message]);
      })
      .catch(result => {
        return Observable.of(
          this.processFailure(result, this.getConfigValue('login.redirect.failure'), [result.message]),
        );
      });
  }

  register(data?: any): Observable<NbAuthResult> {
    return this.accountService.signOnWithEmailAndPassword(data.email, data.password)
      .mergeMap(result => {
        return this.accountService.updateDisplayName(data.fullName)
          .map(update => {
            return this.processSuccess(result, this.getConfigValue('register.redirect.success'), [result.message]);
          });
      })
      .catch(result => {
        return Observable.of(
          this.processFailure(result, this.getConfigValue('register.redirect.failure'), [result.message]),
        );
      });
  }

  requestPassword(data?: any): Observable<NbAuthResult> {
    return this.accountService.sendPasswordResetEmail(data.email)
      .map(result => {
        return this.processSuccess(result, this.getConfigValue('requestPass.redirect.success'), []);
      })
      .catch(result => {
        return Observable.of(
          this.processFailure(result, this.getConfigValue('requestPass.redirect.failure'), [result.message])
        );
      });
  }

  resetPassword(data?: any): Observable<NbAuthResult> {
    if (this.accountService.profile.getValue()) {
      return this.accountService.updatePassword(data.password)
        .map(result => {
          return this.processSuccess(result, this.getConfigValue('resetPass.redirect.success'), []);
        })
        .catch(result => {
          return Observable.of(
            this.processFailure(result, this.getConfigValue('resetPass.redirect.failure'), [result.message])
          );
        });
    }

    return Observable.of(
      this.processFailure([], this.getConfigValue('resetPass.redirect.failure'), ['Please, sign in to be able to reset your password'])
    );
  }

  logout(data?: any): Observable<NbAuthResult> {
    return this.accountService.signOut()
      .map(result => {
        return this.processSuccess(result, this.getConfigValue('logout.redirect.success'), []);
      })
      .catch(result => {
        return Observable.of(
          this.processFailure(result, this.getConfigValue('logout.redirect.failure'), [result.message])
        );
      });
  }

  private processSuccess(response?: any, redirect?: any, messages?: any): NbAuthResult {
    return new NbAuthResult(true, response, redirect, [], messages);
  }

  private processFailure(response?: any, redirect?: any, errors?: any): NbAuthResult {
    return new NbAuthResult(false, response, redirect, errors, []);
  }
}
