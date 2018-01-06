import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsComponent } from './checklists/checklists.component';

const checklistsRoutes: Routes = [
  { path: '', component: ChecklistsComponent, pathMatch: 'full' },
  { path: 'tags/:tag', component: ChecklistsComponent, pathMatch: 'full' },
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
