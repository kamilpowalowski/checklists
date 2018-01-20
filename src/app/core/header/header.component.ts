import { Account } from './../../shared/account.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NbMenuService, NbSidebarService, NbMenuItem } from '@nebular/theme';
import { AccountService } from '../../shared/account.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  userName: string;
  userMenu: NbMenuItem[] = [];

  constructor(
    private sidebarService: NbSidebarService,
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.accountService.account
      .subscribe(account => {
        if (account) {
          this.setLoggedInState(account);
        } else {
          this.setAnonymousState();
        }
      });
  }

  ngOnDestroy() {

  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  private setAnonymousState() {
    this.userName = 'Anonymous';
    this.userMenu = [
      { title: 'Log in', link: '/auth/login' },
      { title: 'Register', link: '/auth/register' }
    ];
  }

  private setLoggedInState(account: Account) {
    this.userName = account.displayName ? account.displayName : 'Active user';
    this.userMenu = [
      { title: 'Profile', link: '/profile' },
      { title: 'Log out', link: '/auth/logout' }
    ];
  }
}
