import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
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
          this.router.navigate(['/auth', 'login']);
        }
      });
  }

}
