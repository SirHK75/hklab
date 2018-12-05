import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { SimpleLayoutComponent } from './simple/simple.component';
import { SideBarLayoutComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    SimpleLayoutComponent,
    SideBarLayoutComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
  ],
  exports: [
    SimpleLayoutComponent,
    SideBarLayoutComponent,
  ],
  providers: [],
  bootstrap: []
})

export class LayoutsModule { }
