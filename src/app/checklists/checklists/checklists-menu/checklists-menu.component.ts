import { NbMenuService, NbMenuItem } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checklists-menu',
  templateUrl: './checklists-menu.component.html',
  styleUrls: ['./checklists-menu.component.scss']
})
export class ChecklistsMenuComponent implements OnInit {

  items: NbMenuItem[] = [];

  constructor(private menuService: NbMenuService) { }

  ngOnInit() {
    this.items = [
      {
        title: 'featured',
        link: '/checklists/featured',
      }
    ];
  }

}
