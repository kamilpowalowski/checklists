import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { ChecklistItem } from '../../shared/checklist-item.model';
import { Checklist } from '../../shared/checklist.model';
import { ChecklistService } from '../../shared/checklist.service';
import { AccountService } from './../../shared/account.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  checklist: Observable<Checklist>;
  items: Observable<ChecklistItem[]>;

  constructor(
    public accountService: AccountService,
    private checklistService: ChecklistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        const id = params['id'];
        this.checklist = this.checklistService.observeChecklist(id, true);
        this.items = this.checklist.mergeMap(checklist => checklist.items);
      });
  }
}
