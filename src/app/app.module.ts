import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbAuthModule, NbAuthOptions } from '@nebular/auth';
import { NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MetaLoader,
  MetaModule,
  MetaStaticLoader,
  PageTitlePositioning
  } from '@ngx-meta/core';
import { EmojiModule } from 'angular-emojione';
import { ToasterModule } from 'angular2-toaster';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ModalsModule } from './modals/modals.module';
import { angularticsSettings } from './settings/angulartics.settings';
import { authModuleSettings } from './settings/auth-module.settings';
import { cookieSettings } from './settings/cookie.settings';
import { FirebaseAuthenticationProvider } from './shared/services/firebase-authentication.provider';
import { SharedModule } from './shared/shared.module';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DEFAULT_THEME } from './styles/theme.default';

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'lizt.co - checklists made easy',
    defaults: {
      title: 'lizt.co - checklists made easy',
      description: 'community-driven website for creating and sharing checklists',
      'og:type': 'website',
      'og:locale': 'en_US'
    }
  });
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics], angularticsSettings),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NbThemeModule.forRoot(
      { name: 'default' },
      [DEFAULT_THEME, COSMIC_THEME]
    ),
    NbAuthModule.forRoot(authModuleSettings),
    NgbModule.forRoot(),
    MarkdownModule.forRoot(),
    ToasterModule.forRoot(),
    MetaModule.forRoot({ provide: MetaLoader, useFactory: (metaFactory) }),
    EmojiModule,
    NgcCookieConsentModule.forRoot(cookieSettings),
    SharedModule,
    CoreModule,
    ModalsModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private firestore: AngularFirestore) {
    firestore.firestore.settings({ timestampsInSnapshots: true });
  }
}
