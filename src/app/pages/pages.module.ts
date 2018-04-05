import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { AboutComponent } from './about/about.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    NbCardModule
  ],
  declarations: [AboutComponent]
})
export class PagesModule { }
