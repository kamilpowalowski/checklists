import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Statistics } from '../shared/models/statistics.model';
import { OpenStartupService } from '../shared/services/open-startup.service';

@Component({
  selector: 'app-open-startup-statistic',
  templateUrl: './open-startup-statistic.component.html',
  styleUrls: ['./open-startup-statistic.component.scss']
})
export class OpenStartupStatisticComponent implements OnInit {

  statistics: Observable<Statistics>;

  constructor(private openStartupService: OpenStartupService) { }

  ngOnInit() {
    this.statistics = this.openStartupService.observeOpenStartupStatistics();
  }

}
