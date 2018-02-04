import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../shared/authenticated-guard.service';
import { AccountChecklistsComponent } from './account-checklists/account-checklists.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsComponent } from './checklists/checklists.component';

const checklistsRoutes: Routes = [
  { path: '', redirectTo: 'featured', pathMatch: 'full' },
  { path: 'featured', component: ChecklistsComponent, pathMatch: 'full', data: { featured: true } },
  { path: 'tags/:tag', component: ChecklistsComponent, pathMatch: 'full', data: { featured: false } },
  { path: 'me', canActivate: [AuthenticatedGuard], component: AccountChecklistsComponent, pathMatch: 'full' },
  { path: 'me/tags/:tag', canActivate: [AuthenticatedGuard], component: AccountChecklistsComponent, pathMatch: 'full' },
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
