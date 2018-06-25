import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menu: NbMenuItem[] = [];

  constructor(private menuService: NbMenuService) { }

  ngOnInit() {
    this.menu = [
      {
        title: 'Home',
        icon: 'nb-home',
        link: '/home',
        pathMatch: 'full',
        home: true
      },
      {
        title: 'Public',
        icon: 'nb-cloudy',
        link: '/checklists/public',
        pathMatch: 'not-full'
      },
      {
        title: 'My',
        icon: 'nb-star',
        link: '/checklists/me',
        pathMatch: 'not-full'
      },
      {
        title: 'Account',
        icon: 'nb-person',
        link: '/account',
        pathMatch: 'full'
      },
      {
        title: 'About',
        icon: 'nb-lightbulb',
        link: '/info/about',
        pathMatch: 'full'
      }
    ];
  }
}
