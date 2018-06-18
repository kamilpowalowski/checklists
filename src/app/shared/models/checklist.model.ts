import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as smartunique from 'smartunique';
import { Account } from './account.model';
import { ChecklistItem } from './checklist-item.model';

export class Checklist {
  items = new BehaviorSubject<ChecklistItem[]>([]);

  constructor(
    public id: string | null,
    public owner: string,
    public created: Date,
    public title: string,
    public description: string | null,
    public tags: string[],
    public isPublic: boolean | null,
    items: Observable<ChecklistItem[]> | null
  ) {
    this.id = id ? id : smartunique.shortId();
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

  rawValue(): { [key: string]: any } {
    const result = {
      'title': this.title,
      'description': this.description,
      'owner': this.owner,
      'tags': {},
      'public': this.isPublic,
      'created': this.created,
      'edited': firebase.firestore.FieldValue.serverTimestamp()
    };

    for (const tag of this.tags) {
      result['tags'][tag] = true;
    }

    return result;
  }

  titleInUrlForm(): string {
    return this.title
      .toLowerCase()
      .replace(/[^\w\-\s]+/g, '')       // Remove all non-word chars
      .trim()                          // Trim spaces from end of text
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  }
}
