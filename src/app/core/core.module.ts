import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbCardModule,
  NbContextMenuModule,
  NbLayoutModule,
  NbMenuModule,
  NbMenuService,
  NbPopoverModule,
  NbSidebarModule,
  NbUserModule
  } from '@nebular/theme';
import { EmojiModule } from 'angular-emojione';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToasterModule } from 'angular2-toaster';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeFeaturedChecklistsComponent } from './home/home-featured-checklists/home-featured-checklists.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
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
    NbPopoverModule,
    NbCardModule,
    EmojiModule,
    ToasterModule.forChild()
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LayoutComponent,
    SidebarComponent,
    ThemeSwitcherComponent,
    SidebarFooterComponent,
    SidebarHeaderComponent,
    NotFoundComponent,
    HomeFeaturedChecklistsComponent
  ],
  exports: [],
  providers: [
    ...NbMenuModule.forRoot().providers,
    ...NbSidebarModule.forRoot().providers
  ]
})
export class CoreModule { }
