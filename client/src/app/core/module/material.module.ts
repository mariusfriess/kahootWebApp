import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule, MatIconModule, MatRippleModule, MatExpansionModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule { }
