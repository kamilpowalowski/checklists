import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyComponent } from './policy/policy.component';
import { TermsComponent } from './terms/terms.component';

const legalRoutes: Routes = [
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'policy',
    component: PolicyComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(legalRoutes)
  ],
  exports: [RouterModule],
})
export class LegalRoutingModule {

}
