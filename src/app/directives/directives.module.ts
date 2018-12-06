import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  HighlightDirective,
} from './highlight.directive';

@NgModule({
  declarations: [
    HighlightDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HighlightDirective,
  ],
  entryComponents: []
})
export class DirectivesModule {}
