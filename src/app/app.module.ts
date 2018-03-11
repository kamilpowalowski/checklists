import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbAuthModule, NbAuthOptions, NbEmailPassAuthProvider } from '@nebular/auth';
import { NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmojiModule } from 'angular-emojione';
import { CookieLawModule } from 'angular2-cookie-law';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ModalComponent } from './modal/modal.component';
import { FirebaseAuthenticationProvider } from './shared/firebase-authentication.provider';
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

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'lizt-co'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbAuthModule.forRoot(authModuleSettings),
    NgbModule.forRoot(),
    MarkdownModule.forRoot(),
    EmojiModule,
    CookieLawModule,
    SharedModule,
    CoreModule
  ],
  declarations: [
    AppComponent,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
