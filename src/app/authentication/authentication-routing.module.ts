import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbLogoutComponent, NbRequestPasswordComponent, NbResetPasswordComponent } from '@nebular/auth';
import { AuthenticatedGuard } from '../shared/services/authenticated-guard.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const authenticationRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', canActivate: [AuthenticatedGuard], component: NbLogoutComponent },
  { path: 'request-password', component: NbRequestPasswordComponent },
  { path: 'reset-password', canActivate: [AuthenticatedGuard], component: NbResetPasswordComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(authenticationRoutes)
  ],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {

}
