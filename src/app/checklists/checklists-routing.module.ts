import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsComponent } from './checklists/checklists.component';

const checklistsRoutes: Routes = [
  { path: '', redirectTo: 'featured', pathMatch: 'full' },
  { path: 'featured', component: ChecklistsComponent, pathMatch: 'full', data: { featured: true } },
  { path: 'tags/:tag', component: ChecklistsComponent, pathMatch: 'full', data: { featured: false } },
  { path: ':id', component: ChecklistComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(checklistsRoutes)
  ],
  exports: [RouterModule],
})
export class ChecklistsRoutingModule {

}
