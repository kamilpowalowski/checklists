import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenStartupStatisticComponent } from './open-startup-statistic/open-startup-statistic.component';

const openRoutes: Routes = [
  {
    path: '',
    component: OpenStartupStatisticComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(openRoutes)
  ],
  exports: [RouterModule],
})
export class OpenRoutingModule {

}
