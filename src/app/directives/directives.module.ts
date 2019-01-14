import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HighlightDirective } from './highlight.directive';
import { TooltipDirective } from './tooltip.directive';
import { SliderDirective } from './slider.directive';

@NgModule({
  declarations: [
    HighlightDirective,
    TooltipDirective,
    SliderDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HighlightDirective,
    TooltipDirective,
    SliderDirective,
  ],
  entryComponents: []
})
export class DirectivesModule {}
