import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService) {
  }

  ngOnInit() {

  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
