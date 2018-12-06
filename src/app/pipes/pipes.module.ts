import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  FileSizePipe,
} from './pipes.pipe';

@NgModule({
  declarations: [
    FileSizePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    FileSizePipe,
  ],
  entryComponents: []
})
export class PipesModule {}
