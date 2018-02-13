import {
  Component,
  Input,
  OnDestroy,
  OnInit
  } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { AccountService } from '../../shared/account.service';
import { Account } from './../../shared/account.model';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  userName: string;
  userPhoto: string;
  userMenu: NbMenuItem[] = [];

  constructor(
    private router: Router,
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

  createChecklist() {
    this.router.navigate(['/checklists', 'new']);
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
    this.userPhoto = account.photo;
    this.userMenu = [
      { title: 'Profile', link: '/profile' },
      { title: 'Log out', link: '/auth/logout' }
    ];
  }
}
