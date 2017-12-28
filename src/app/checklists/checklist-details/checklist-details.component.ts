import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChecklistService } from '../../shared/checklist.service';
import { Checklist } from '../../shared/checklist.model';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-checklist-details',
  templateUrl: './checklist-details.component.html',
  styleUrls: ['./checklist-details.component.scss']
})
export class ChecklistDetailsComponent implements OnInit {

  checklist: Checklist;

  constructor(
    private checklistService: ChecklistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        const id = params['id'];
        this.getChecklist(id);
      });
  }

  shouldPresentDescription(): boolean {
    return this.checklist.description != null && this.checklist.description.length > 0;
  }

  private getChecklist(id: string) {
    this.checklistService.getChecklist(id)
      .take(1)
      .subscribe((checklist) => {
        this.checklist = checklist;
      });
  }

}
