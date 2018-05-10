import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Checklist } from '../../shared/models/checklist.model';
import { ChecklistsService } from '../../shared/services/checklists.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  moreVisible = false;
  featuredChecklists: Observable<Checklist[]>;

  constructor(private checklistsService: ChecklistsService) { }

  ngOnInit() {
    this.featuredChecklists = this.checklistsService.observeFeaturedChecklists();
  }

  toggleMoreVisible() {
    this.moreVisible = !this.moreVisible;
  }

}
