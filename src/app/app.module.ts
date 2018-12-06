import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

// pipes
import { PipesModule } from './pipes/pipes.module';
// directives
import { DirectivesModule } from './directives/directives.module';
// layouts
import { LayoutsModule } from './layouts/layouts.module';
// components
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    ComponentsModule,
    RouterModule,
    PipesModule,
    DirectivesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
