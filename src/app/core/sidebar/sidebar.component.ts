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
        title: 'Public checklists',
        icon: 'nb-list',
        link: '/checklists/featured',
        pathMatch: 'not-full'
      },
      {
        title: 'My checklists',
        icon: 'nb-person',
        link: '/checklists/me/all',
        pathMatch: 'not-full'
      }
    ];
  }
}
