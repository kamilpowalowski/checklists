import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule, NbThemeModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from './../shared/shared.module';
import { OpenRoutingModule } from './open-routing.module';
import { OpenStartupChartComponent } from './open-startup-chart/open-startup-chart.component';
import { OpenStartupStatisticComponent } from './open-startup-statistic.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OpenRoutingModule,
    NbCardModule,
    NbThemeModule,
    NgxEchartsModule
  ],
  declarations: [OpenStartupStatisticComponent, OpenStartupChartComponent]
})
export class OpenModule { }
