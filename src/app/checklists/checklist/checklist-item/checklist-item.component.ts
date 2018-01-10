import { ChecklistItem } from '../../../shared/checklist-item.model';
import { Component, OnInit, Input } from '@angular/core';
import { Checklist } from '../../../shared/checklist.model';
import { ChecklistService } from '../../../shared/checklist.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-checklist-item',
  templateUrl: './checklist-item.component.html',
  styleUrls: ['./checklist-item.component.scss']
})
export class ChecklistItemComponent implements OnInit, OnDestroy {
  @Input() item: ChecklistItem;
  @Input() level: number;

  selected = false;

  private selectedIdsSubscription: Subscription;
  private subitemsSubscription: Subscription;

  constructor(private checklistService: ChecklistService) { }

  ngOnInit() {
    this.selected = this.checklistService.isChecklistItemSelected(this.item);

    this.selectedIdsSubscription = this.checklistService.selectedIds
      .subscribe(() => {
        this.selected = this.checklistService.isChecklistItemSelected(this.item);
      });

    this.subitemsSubscription = this.item.items.asObservable()
      .subscribe(() => {
        this.selected = this.checklistService.isChecklistItemSelected(this.item);
      });
  }

  ngOnDestroy() {
    this.selectedIdsSubscription.unsubscribe();
    this.subitemsSubscription.unsubscribe();
  }

  getClassesForLevel(level: number): string[] {
    const columnClass = `col-md-${(12 - level)}`;
    const offsetClass = `offset-md-${level}`;
    return [columnClass, offsetClass];
  }

  onCheckboxValueChanged(newValue: boolean) {
    this.selected = newValue;
    if (this.selected === true) {
      this.checklistService.markAsSelected(this.item);
    } else {
      this.checklistService.markAsUnselected(this.item);
    }
  }

}
