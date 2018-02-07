import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { HomeComponent } from './core/home/home.component';
import { LayoutComponent } from './core/layout/layout.component';

const appRoutes: Routes = [
  {
    path: 'auth',
    component: NbAuthComponent,
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'checklists',
        loadChildren: './checklists/checklists.module#ChecklistsModule'
      },
      { path: '**', redirectTo: 'home' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
