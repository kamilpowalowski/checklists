import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { MetaGuard } from '@ngx-meta/core';
import { HomeComponent } from './core/home/home.component';
import { LayoutComponent } from './core/layout/layout.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

const appRoutes: Routes = [
  {
    path: 'auth',
    component: NbAuthComponent,
    canActivateChild: [MetaGuard],
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [MetaGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'checklists',
        loadChildren: './checklists/checklists.module#ChecklistsModule'
      },
      {
        path: 'legal',
        loadChildren: './legal/legal.module#LegalModule'
      },
      {
        path: 'info',
        loadChildren: './pages/pages.module#PagesModule'
      },
      {
        path: 'account',
        loadChildren: './account/account.module#AccountModule'
      },
      {
        path: 'open',
        loadChildren: './open/open.module#OpenModule'
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      },
      { path: '**', redirectTo: 'not-found' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
