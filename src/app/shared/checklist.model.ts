import { ChecklistItem } from './checklist-item.model';
import { v4 as uuid } from 'uuid';

export class Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  tags: string;

  constructor(title: string, description: string, items: ChecklistItem[]) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.items = items != null ? items : [];
  }
}
