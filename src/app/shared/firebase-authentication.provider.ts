/**
 * Based on MolochkoVitaly fork of nebular
 * https://github.com/MolochkoVitaly/nebular
 */

import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NbAbstractAuthProvider, NbAuthResult } from '@nebular/auth';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import * as firebase from 'firebase';
import { AccountService } from './account.service';

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

  /**
   * Firebase authentication.
   *
   * @param data any
   * @returns Observable<NbAuthResult>
   */
  authenticate(data?: any): Observable<NbAuthResult> {
    return this.accountService.signInWithEmailAndPassword(data.email, data.password)
      .map(res => {
        return this.processSuccess(res, this.getConfigValue('login.redirect.success'), [res.message]);
      })
      .catch(res => {
        return Observable.of(
          this.processFailure(res, this.getConfigValue('login.redirect.failure'), [res.message]),
        );
      });
  }

  /**
   * Firebase registration.
   *
   * @param data any
   * @returns Observable<NbAuthResult>
   */
  register(data?: any): Observable<NbAuthResult> {
    return this.accountService.signOnWithEmailAndPassword(data.email, data.password)
      .mergeMap(res => {
        return this.accountService.updateProfile(data.fullName)
          .map(update => {
            return this.processSuccess(res, this.getConfigValue('register.redirect.success'), [res.message]);
          });
      })
      .catch(res => {
        return Observable.of(
          this.processFailure(res, this.getConfigValue('register.redirect.failure'), [res.message]),
        );
      });
  }

  /**
   * Firebase restore password.
   *
   * @param data any
   * @returns Observable<NbAuthResult>
   */
  requestPassword(data?: any): Observable<NbAuthResult> {
    return this.accountService.sendPasswordResetEmail(data.email)
      .map(res => {
        return this.processSuccess(res, this.getConfigValue('requestPass.redirect.success'), []);
      })
      .catch(res => {
        return Observable.of(
          this.processFailure(res, this.getConfigValue('requestPass.redirect.failure'), [res.message])
        );
      });
  }

  /**
   * Firebase reset password.
   *
   * @param data any
   * @returns Observable<NbAuthResult>
   */
  resetPassword(data?: any): Observable<NbAuthResult> {
    if (this.accountService.account.value) {
      return this.accountService.updatePassword(data.password)
        .map(res => {
          return this.processSuccess(res, this.getConfigValue('resetPass.redirect.success'), []);
        })
        .catch(res => {
          return Observable.of(
            this.processFailure(res, this.getConfigValue('resetPass.redirect.failure'), [res.message])
          );
        });
    }

    return Observable.of(
      this.processFailure([], this.getConfigValue('resetPass.redirect.failure'), ['Please, sign in to be able to reset your password'])
    );
  }

  /**
   * Firebase logout.
   *
   * @param data any
   * @returns Observable<NbAuthResult>
   */
  logout(data?: any): Observable<NbAuthResult> {
    return this.accountService.signOut()
      .map(res => {
        return this.processSuccess(res, this.getConfigValue('logout.redirect.success'), []);
      })
      .catch(res => {
        return Observable.of(
          this.processFailure(res, this.getConfigValue('logout.redirect.failure'), [res.message])
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
