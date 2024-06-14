import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {SidebarService} from "@services/sidebar.service";
import {ChatService} from "@services/chat.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(protected readonly sidebarService: SidebarService, protected readonly chatService: ChatService) { }

  ngOnInit() {
    this.chatService.getHistory();
  }

}
