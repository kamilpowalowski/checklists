import { NbActionsModule, NbMenuModule, NbMenuService, NbSidebarModule, NbUserModule, NbLayoutModule } from '@nebular/theme';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { SidebarFooterComponent } from './sidebar-footer/sidebar-footer.component';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbActionsModule,
    NbMenuModule,
    NbLayoutModule,
    NbSidebarModule,
    NbUserModule
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
