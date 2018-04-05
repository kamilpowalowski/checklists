import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';

const pagesRoutes: Routes = [
  {
    path: 'about',
    component: AboutComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule {

}
