import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../shared/services/authenticated-guard.service';
import { AccountComponent } from './account/account.component';

const accountRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    component: AccountComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(accountRoutes)
  ],
  exports: [RouterModule],
})
export class AccountRoutingModule {

}
