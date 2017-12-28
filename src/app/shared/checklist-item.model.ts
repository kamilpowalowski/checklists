
export class ChecklistItem {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];

  constructor(title: string, description: string, items: ChecklistItem[]) {
    this.title = title;
    this.description = description;
    this.items = items;
  }
}
