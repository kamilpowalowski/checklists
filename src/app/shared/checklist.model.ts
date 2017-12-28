import { ChecklistItem } from './checklist-item.model';

export class Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  tags: string;

  constructor(title: string, description: string, items: ChecklistItem[]) {
    this.title = title;
    this.description = description;
    this.items = items;
  }
}
