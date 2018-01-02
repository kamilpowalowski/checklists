import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { NbThemeModule, NbLayoutModule, NbSidebarModule } from '@nebular/theme';
import { MarkdownModule } from 'ngx-markdown';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'checklists'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    NbSidebarModule,
    MarkdownModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    CoreModule
  ],
  providers: [
    ...NbSidebarModule.forRoot().providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
