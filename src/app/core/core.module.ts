import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbContextMenuModule,
  NbLayoutModule,
  NbMenuModule,
  NbMenuService,
  NbPopoverModule,
  NbSidebarModule,
  NbUserModule
  } from '@nebular/theme';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarFooterComponent } from './sidebar-footer/sidebar-footer.component';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularSvgIconModule,
    NbActionsModule,
    NbMenuModule,
    NbLayoutModule,
    NbSidebarModule,
    NbUserModule,
    NbContextMenuModule,
    NbPopoverModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LayoutComponent,
    SidebarComponent,
    ThemeSwitcherComponent,
    SidebarFooterComponent,
    SidebarHeaderComponent
  ],
  exports: [],
  providers: [
    ...NbMenuModule.forRoot().providers,
    ...NbSidebarModule.forRoot().providers
  ]
})
export class CoreModule { }
