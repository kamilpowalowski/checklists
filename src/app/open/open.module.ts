import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OpenRoutingModule } from './open-routing.module';
import { OpenStartupStatisticComponent } from './open-startup-statistic/open-startup-statistic.component';

@NgModule({
  imports: [
    CommonModule,
    OpenRoutingModule
  ],
  declarations: [OpenStartupStatisticComponent]
})
export class OpenModule { }
