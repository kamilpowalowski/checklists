import { Component, Input, OnChanges } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

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

  constructor() { }

  ngOnChanges() {
    if (this.tags) {
      if (this.tags.length > 0) {
        this.createItems(this.tags);
      } else {
        this.createEmptyMenu('Empty list');
      }
    } else {
      this.createEmptyMenu('Loading...');
    }
  }

  private createItems(tags: string[]) {
    this.items = tags.map(tag => {
      return {
        title: `#${tag}`,
        link: `${this.initialPath}/tags/${tag}`,
        pathMatch: 'full'
      };
    });
  }

  private createEmptyMenu(text: string) {
    this.items = [
      {
        title: text,
        group: true
      }
    ];
  }

}
