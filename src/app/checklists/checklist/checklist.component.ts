import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChecklistService } from '../../shared/checklist.service';
import { Checklist } from '../../shared/checklist.model';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { ChecklistItem } from '../../shared/checklist-item.model';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  checklist: Observable<Checklist>;
  items: Observable<ChecklistItem[]>;

  constructor(
    private checklistService: ChecklistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        const id = params['id'];
        this.checklist = this.checklistService.observeChecklist(id);
        this.items = this.checklist.mergeMap(checklist => checklist.items);
      });
  }
}
