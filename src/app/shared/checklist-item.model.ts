import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { v4 as uuid } from 'uuid';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';

export class ChecklistItem {
  items = new BehaviorSubject<ChecklistItem[]>([]);

  constructor(
    public id: string,
    public order: number,
    public title: string,
    public description: string,
    items: Observable<ChecklistItem[]>
  ) {
    this.id = id ? id :  uuid();
    this.description = description ? description : '';
    items
      .take(1)
      .subscribe(currentItems => {
        this.items.next(currentItems);
      });
  }
}
