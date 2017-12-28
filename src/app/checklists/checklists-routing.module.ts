import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChecklistDetailsComponent } from './checklist-details/checklist-details.component';
import { ChecklistsCollectionComponent } from './checklists-collection/checklists-collection.component';

const checklistsRoutes: Routes = [
  { path: '', component: ChecklistsCollectionComponent, pathMatch: 'full' },
  { path: ':id', component: ChecklistDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(checklistsRoutes)
  ],
  exports: [RouterModule],
})
export class ChecklistsRoutingModule {

}
