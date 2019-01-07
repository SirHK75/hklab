import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SideBarLayoutComponent {

  menuItems = [
    {
      name: 'Home',
      icon: 'fa fa-home',
      route: '/home'
    },
    // {
    //   name: 'Documentation',
    //   icon: 'fas fa-clipboard-list',
    //   route: '/documentation'
    // },
    {
      name: 'Pipes',
      icon: 'fas fa-filter',
      route: '/pipes'
    },
    {
      name: 'Directives',
      icon: 'fas fa-exchange-alt',
      route: '/directives'
    },
    {
      name: 'Bootstrap',
      icon: 'fab fa-css3',
      route: '/bootstrap'
    },
    {
      name: 'Biker',
      icon: 'fas fa-bicycle',
      route: '/biker'
    },
    {
      name: 'Test',
      icon: 'fas fa-question',
      route: '/test'
    },
    {
      name: 'UI Kits',
      icon: 'fab fa-uikit',
      route: '/uikit'
    },
    {
      name: 'Classes/Vars',
      icon: 'fas fa-code',
      route: '/vars'
    },
  ];

}
