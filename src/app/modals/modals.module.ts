import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ShareButtonsOptions } from '@ngx-share/core';
import { ModalComponent } from './modal/modal.component';
import { ShareModalComponent } from './share-modal/share-modal.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientJsonpModule,
    ShareButtonsModule.forRoot()
  ],
  declarations: [
    ModalComponent,
    ShareModalComponent
  ],
  entryComponents: [
    ModalComponent,
    ShareModalComponent
  ],
})
export class ModalsModule { }
