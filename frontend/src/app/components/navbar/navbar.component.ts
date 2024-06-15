import { Component } from '@angular/core';
import {SidebarService} from "@services/sidebar.service";
import {ChatService} from "@services/chat.service";
import {ThemeService} from "@services/theme.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(protected readonly sidebarService : SidebarService, private readonly chatService: ChatService, private readonly themeService: ThemeService) { }

  newConversation(){
    if(this.chatService.messages.length === 0) return;
    this.chatService.currentGroupId = this.chatService.messagesGroup[this.chatService.messagesGroup.length - 1].id + 1;
    this.chatService.messages = [];
  }

  toggleTheme(){
    this.themeService.lightMode = !this.themeService.lightMode;
  }

  getThemeIcon(){
    return this.themeService.lightMode ? "light-theme.svg" : "dark-theme.svg";
  }

}
