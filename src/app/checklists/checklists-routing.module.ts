import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../shared/authenticated-guard.service';
import { AccountChecklistsComponent } from './account-checklists/account-checklists.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsComponent } from './checklists/checklists.component';

const checklistsRoutes: Routes = [
  {
    path: 'public',
    children: [
      { path: '', redirectTo: 'featured', pathMatch: 'full' },
      {
        path: 'featured',
        component: ChecklistsComponent,
        pathMatch: 'full',
        data: { featured: true }
      },
      {
        path: 'tags/:tag',
        component: ChecklistsComponent,
        pathMatch: 'full',
        data: { featured: false }
      }
    ]
  },
  {
    path: 'me',
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'all',
        canActivate: [AuthenticatedGuard],
        component: AccountChecklistsComponent,
        pathMatch: 'full',
        data: { onlyPublic: false }
      },
      {
        path: 'public',
        canActivate: [AuthenticatedGuard],
        component: AccountChecklistsComponent,
        pathMatch: 'full',
        data: { onlyPublic: true }
      },
      {
        path: 'tags/:tag',
        canActivate: [AuthenticatedGuard],
        component: AccountChecklistsComponent,
        pathMatch: 'full',
        data: { onlyPublic: false }
      },
    ]
  },
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
