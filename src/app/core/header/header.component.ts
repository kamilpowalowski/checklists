import {
  Component,
  Input,
  OnDestroy,
  OnInit
  } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';
import { AccountService } from '../../shared/services/account.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  name: string;
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
    this.accountService.profile
      .subscribe(profile => {
        if (profile) {
          this.setLoggedInState(profile.user);
        } else {
          this.setAnonymousState();
        }
      });
    this.name = environment.production ? 'lizt.co' : '[dev]lizt.co';
  }

  ngOnDestroy() {

  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  private setAnonymousState() {
    this.userName = 'Anonymous';
    this.userPhoto = null;
    this.userMenu = [
      { title: 'Log in', link: '/auth/login' },
      { title: 'Register', link: '/auth/register' }
    ];
  }

  private setLoggedInState(user: User) {
    this.userName = user.displayName ? user.displayName : 'Active user';
    this.userPhoto = user.photo;
    this.userMenu = [
      { title: 'My account', link: '/account' },
      { title: 'Log out', link: '/auth/logout' }
    ];
  }
}
