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
      name: 'Bootstrap',
      icon: 'fab fa-css3',
      route: '/bootstrap'
    },
    {
      name: 'Test',
      icon: 'fas fa-question',
      route: '/test'
    },
  ];

}
