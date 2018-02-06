import { Component, Input, OnChanges } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';

@Component({
  selector: 'app-checklists-tags',
  templateUrl: './checklists-tags.component.html',
  styleUrls: ['./checklists-tags.component.scss']
})
export class ChecklistsTagsComponent implements OnChanges {
  @Input() tags: string[];
  @Input() title: string;
  @Input() initialPath: string;

  items: NbMenuItem[] = [];

  constructor(private menuService: NbMenuService) { }

  ngOnChanges() {
    this.creatItems(this.tags ? this.tags : []);
  }

  private creatItems(tags: string[]) {
    this.items = tags.map(tag => {
      return {
        title: `#${tag}`,
        link: `${this.initialPath}/tags/${tag}`
      };
    });
  }

}
