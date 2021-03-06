import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

// Directives
import { DirectivesModule } from '../directives/directives.module';

// Components
import { HomeComponent } from './home/home.component';
import { BootstrapComponent } from './bootstrap/bootstrap.component';
import { TestComponent } from './test/test.component';
import { BikerComponent } from './biker/biker.component';
import { PipesComponent } from './pipes/pipes.component';
import { DirectivesComponent } from './directives/directives.component';
import { UIKitComponent } from './uikit/uikit.component';
import { VariablesComponent } from './variables/variables.component';
import { SlidersComponent } from './sliders/sliders.component';

@NgModule({
  declarations: [
    HomeComponent,
    BootstrapComponent,
    TestComponent,
    BikerComponent,
    PipesComponent,
    DirectivesComponent,
    UIKitComponent,
    VariablesComponent,
    SlidersComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    PipesModule,
    DirectivesModule,
  ],
  exports: [
    HomeComponent,
    BootstrapComponent,
    TestComponent,
    BikerComponent,
    PipesComponent,
    DirectivesComponent,
    UIKitComponent,
    VariablesComponent,
    SlidersComponent,
  ],
  providers: [],
  bootstrap: []
})

export class ComponentsModule { }
