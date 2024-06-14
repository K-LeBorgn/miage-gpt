import { Component } from '@angular/core';
import {SidebarService} from "@services/sidebar.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(protected readonly sidebarService : SidebarService) { }

}
