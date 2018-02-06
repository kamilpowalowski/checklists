import { Component, Input, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';

@Component({
  selector: 'app-checklists-menu',
  templateUrl: './checklists-menu.component.html',
  styleUrls: ['./checklists-menu.component.scss']
})
export class ChecklistsMenuComponent implements OnInit {

  @Input() title: string;
  @Input() items: NbMenuItem[] = [];

  constructor(private menuService: NbMenuService) { }

  ngOnInit() {
  }

}
