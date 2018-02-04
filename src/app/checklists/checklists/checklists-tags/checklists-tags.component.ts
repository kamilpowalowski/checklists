import { Component, OnChanges, Input } from '@angular/core';
import { NbMenuService, NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-checklists-tags',
  templateUrl: './checklists-tags.component.html',
  styleUrls: ['./checklists-tags.component.scss']
})
export class ChecklistsTagsComponent implements OnChanges {
  @Input() tags: string[];
  @Input() title: string;

  items: NbMenuItem[] = [];

  constructor(private menuService: NbMenuService) { }

  ngOnChanges() {
    this.creatItems(this.tags ? this.tags : []);
  }

  private creatItems(tags: string[]) {
    this.items = tags.map(tag => {
      return {
        title: `#${tag}`,
        link: `/checklists/tags/${tag}`,
      };
    });
  }

}
