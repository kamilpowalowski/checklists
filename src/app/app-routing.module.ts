import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent
} from '@nebular/auth';
import { HomeComponent } from './core/home/home.component';
import { LayoutComponent } from './core/layout/layout.component';

const appRoutes: Routes = [
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '',
  component: LayoutComponent,
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'checklists', loadChildren: './checklists/checklists.module#ChecklistsModule' },
    { path: '**', redirectTo: 'home' }
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
