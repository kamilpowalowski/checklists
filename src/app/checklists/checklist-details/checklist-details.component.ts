import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChecklistService } from '../../shared/checklist.service';
import { Checklist } from '../../shared/checklist.model';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { ChecklistItem } from '../../shared/checklist-item.model';

@Component({
  selector: 'app-checklist-details',
  templateUrl: './checklist-details.component.html',
  styleUrls: ['./checklist-details.component.scss']
})
export class ChecklistDetailsComponent implements OnInit {

  checklist: Observable<Checklist>;
  description = '';
  items: Observable<ChecklistItem[]>;

  constructor(
    private checklistService: ChecklistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        const id = params['id'];
        this.checklist = this.checklistService.getChecklist(id)
          .do((checklist) => {
            this.description = checklist.description;
          });
        this.items = this.checklist.mergeMap(checklist => checklist.items);
      });
  }
}
