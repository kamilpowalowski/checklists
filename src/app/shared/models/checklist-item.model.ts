import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as smartunique from 'smartunique';

export class ChecklistItem {

  constructor(
    public id: string,
    public order: number,
    public title: string,
    public description: string,
    public subitems: ChecklistItem[]
  ) {
    this.id = id ? id : smartunique.shortId();
    this.description = description ? description : '';
  }

  static sort(lhs: ChecklistItem, rhs: ChecklistItem): number {
    return lhs.order - rhs.order;
  }

  rawValue(): { [key: string]: any } {
    const result = {
      'title': this.title,
      'description': this.description,
      'order': this.order,
      'subitems': {}
    };

    for (const subitem of this.subitems) {
      result['subitems'][subitem.id] = subitem.rawValue();
    }

    return result;
  }
}
