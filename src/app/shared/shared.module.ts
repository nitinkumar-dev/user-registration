import { NgModule } from '@angular/core';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

@NgModule({
  declarations: [
    MessageDialogComponent
  ],
  exports: [
    MessageDialogComponent
  ]
})
export class SharedModule { }
