import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { LegalRoutingModule } from './legal-routing.module';
import { PolicyComponent } from './policy/policy.component';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  imports: [
    CommonModule,
    LegalRoutingModule,
    NbCardModule
  ],
  declarations: [
    TermsComponent,
    PolicyComponent
  ]
})
export class LegalModule { }
