import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { HomeComponent } from './home/home.component';
import { BootstrapComponent } from './bootstrap/bootstrap.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    HomeComponent,
    BootstrapComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
  ],
  exports: [
    HomeComponent,
    BootstrapComponent,
    TestComponent,
  ],
  providers: [],
  bootstrap: []
})

export class ComponentsModule { }
