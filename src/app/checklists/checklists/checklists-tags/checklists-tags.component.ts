import { Component, OnInit, Input } from '@angular/core';
import { NbMenuService, NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-checklists-tags',
  templateUrl: './checklists-tags.component.html',
  styleUrls: ['./checklists-tags.component.scss']
})
export class ChecklistsTagsComponent implements OnInit {
  @Input() tags: string[];
  @Input() selectedTag: string;

  items: NbMenuItem[];

  constructor(private menuService: NbMenuService) { }

  ngOnInit() {
    this.items = this.tags.map((tag) => {
      return {
        title: tag,
        link: '/checklists/tags/' + tag,
      };
    });
  }

}
