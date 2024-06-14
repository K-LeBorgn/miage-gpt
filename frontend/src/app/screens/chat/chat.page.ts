import { Component } from '@angular/core';
import {SidebarComponent} from "@components/sidebar/sidebar.component";
import {ChatViewComponent} from "@components/chat-view/chat-view.component";
import {ChatInputComponent} from "@components/chat-input/chat-input.component";
import {NavbarComponent} from "@components/navbar/navbar.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    SidebarComponent,
    ChatViewComponent,
    ChatInputComponent,
    NavbarComponent
  ],
  templateUrl: './chat.page.html',
  styleUrl: './chat.page.css'
})
export class ChatPage {

}
