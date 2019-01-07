import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  imports: [
    BrowserModule,
    CommonModule,
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
  ],
  providers: [],
  bootstrap: []
})

export class ComponentsModule { }
