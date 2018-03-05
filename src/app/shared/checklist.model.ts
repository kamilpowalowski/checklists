import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { v4 as uuid } from 'uuid';
import { Account } from './account.model';
import { ChecklistItem } from './checklist-item.model';

export class Checklist {
  items = new BehaviorSubject<ChecklistItem[]>([]);

  constructor(
    public id: string,
    public title: string,
    public description: string,
    public tags: string[],
    public isPublic: boolean,
    items: Observable<ChecklistItem[]> | null
  ) {
    this.id = id ? id : uuid();
    this.description = description ? description : '';
    this.tags = tags ? tags : [];
    this.isPublic = isPublic ? isPublic : false;
    if (items) {
      items
        .take(1)
        .subscribe(currentItems => {
          this.items.next(currentItems);
        });
    }
  }

  rawValue(account: Account): { [key: string]: any } {
    const result = {
      'title': this.title,
      'description': this.description,
      'owner': account.id,
      'tags': {},
      'public': this.isPublic
    };

    for (const tag of this.tags) {
      result['tags'][tag] = true;
    }

    return result;
  }
}
