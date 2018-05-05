import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbAuthModule } from '@nebular/auth';
import { NbCheckboxModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NbCheckboxModule,
    NbAuthModule,
    FontAwesomeModule,
    AuthenticationRoutingModule
  ],
  declarations: [LoginComponent, RegisterComponent]
})
export class AuthenticationModule { }
