import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// layouts
import { SimpleLayoutComponent } from './layouts/simple/simple.component';
import { SideBarLayoutComponent } from './layouts/sidebar/sidebar.component';

// components
import { HomeComponent } from './components/home/home.component';
import { BootstrapComponent } from './components/bootstrap/bootstrap.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: SideBarLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        pathMatch: 'full',
        // canActivate: [AuthGuard],
      },
      {
        path: 'test',
        component: TestComponent,
        pathMatch: 'full',
        // canActivate: [AuthGuard],
      },
      {
        path: 'bootstrap',
        component: BootstrapComponent,
        pathMatch: 'full',
        // canActivate: [AuthGuard],
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
