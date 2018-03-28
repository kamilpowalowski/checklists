import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbAuthModule, NbAuthOptions, NbEmailPassAuthProvider } from '@nebular/auth';
import { NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetaLoader } from '@ngx-meta/core';
import { PageTitlePositioning } from '@ngx-meta/core';
import { MetaStaticLoader } from '@ngx-meta/core';
import { MetaModule } from '@ngx-meta/core';
import { EmojiModule } from 'angular-emojione';
import { CookieLawModule } from 'angular2-cookie-law';
import { ToasterModule } from 'angular2-toaster';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ModalsModule } from './modals/modals.module';
import { FirebaseAuthenticationProvider } from './shared/services/firebase-authentication.provider';
import { SharedModule } from './shared/shared.module';

const authModuleSettings: NbAuthOptions = {
  providers: {
    email: {
      service: FirebaseAuthenticationProvider
    },
  },
  forms: {
    validation: {
      password: { minLength: 6 },
      fullName: { required: true }
    }
  }
};

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'lizt.co - checklists made easy',
    defaults: {
      title: 'lizt.co - checklists made easy',
      description: 'community driven website for creating and sharing checklists',
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbAuthModule.forRoot(authModuleSettings),
    NgbModule.forRoot(),
    MarkdownModule.forRoot(),
    ToasterModule.forRoot(),
    MetaModule.forRoot({ provide: MetaLoader, useFactory: (metaFactory) }),
    EmojiModule,
    CookieLawModule,
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
export class AppModule { }
