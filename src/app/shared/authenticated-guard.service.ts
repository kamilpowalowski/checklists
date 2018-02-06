import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
  } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { AuthenticationState } from './authentication-state.enum';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(private router: Router, private accountSerivce: AccountService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.accountSerivce.authenticationState
      .filter(authenticationState => {
        return authenticationState !== AuthenticationState.Unknown;
      })
      .map(authenticationState => {
        return authenticationState === AuthenticationState.Authenticated;
      })
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/auth', 'login'], { queryParams: { 'return-url': state.url }});
        }
      });
  }

}
