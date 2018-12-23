import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    MatInputModule,
    MatButtonModule
  ]
})
export class MaterialModule { }
