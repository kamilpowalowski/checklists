import { AuthenticationRoutingModule } from './authentication-routing.module';
import { NbCheckboxModule } from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NbCheckboxModule,
    NbAuthModule,
    AuthenticationRoutingModule
  ],
  declarations: [LoginComponent, RegisterComponent]
})
export class AuthenticationModule { }
