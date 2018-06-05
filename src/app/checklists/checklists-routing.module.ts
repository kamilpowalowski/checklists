import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../shared/services/authenticated-guard.service';
import { AccountChecklistsComponent } from './account-checklists/account-checklists.component';
import { ChecklistCreateComponent } from './checklist-form/checklist-create.component';
import { ChecklistEditComponent } from './checklist-form/checklist-edit.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistsSearchComponent } from './checklists-search/checklists-search.component';
import { ChecklistsComponent } from './checklists/checklists.component';

const checklistsRoutes: Routes = [
  {
    path: 'public',
    children: [
      {
        path: '',
        redirectTo: 'featured',
        pathMatch: 'full'
      },
      {
        path: 'all',
        component: ChecklistsComponent,
        pathMatch: 'full',
        data: { featured: false }
      },
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
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
      },
      {
        path: 'all',
        canActivate: [AuthenticatedGuard],
        component: AccountChecklistsComponent,
        pathMatch: 'full',
        data: { onlyPublic: false, saved: false }
      },
      {
        path: 'public',
        canActivate: [AuthenticatedGuard],
        component: AccountChecklistsComponent,
        pathMatch: 'full',
        data: { onlyPublic: true, saved: false }
      },
      {
        path: 'saved',
        canActivate: [AuthenticatedGuard],
        component: AccountChecklistsComponent,
        pathMatch: 'full',
        data: { onlyPublic: false, saved: true }
      },
      {
        path: 'tags/:tag',
        canActivate: [AuthenticatedGuard],
        component: AccountChecklistsComponent,
        pathMatch: 'full',
        data: { onlyPublic: false, saved: false }
      },
    ]
  },
  {
    path: 'edit',
    children: [
      {
        path: 'new',
        canActivate: [AuthenticatedGuard],
        component: ChecklistCreateComponent,
        pathMatch: 'full'
      },
      {
        path: ':id',
        canActivate: [AuthenticatedGuard],
        component: ChecklistEditComponent,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'search/:query',
    component: ChecklistsSearchComponent,
    pathMatch: 'full'
  },
  {
    path: ':id/:name',
    component: ChecklistComponent
  },
  {
    path: ':id',
    component: ChecklistComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(checklistsRoutes)
  ],
  exports: [RouterModule],
})
export class ChecklistsRoutingModule {

}
