import { v4 as uuid } from 'uuid';

export class ChecklistItem {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];

  constructor(title: string, description: string, items: ChecklistItem[]) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.items = items != null ? items : [];
  }
}
