import { ChecklistItem } from './checklist-item.model';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';

export class Checklist {
  tags: string;
  items = new BehaviorSubject<ChecklistItem[]>([]);

  constructor(
    public id,
    public title: string,
    public description: string,
    items: Observable<ChecklistItem[]>
  ) {
    this.id = id == null ? uuid() : id;
    this.description = description == null ? '' : description;
    items
      .take(1)
      .subscribe((currentItems) => {
        this.items.next(currentItems);
      });
  }
}
