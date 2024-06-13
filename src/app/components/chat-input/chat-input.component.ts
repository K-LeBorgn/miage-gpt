import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {ChatService} from "@services/chat.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    FormsModule
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {

  constructor(private readonly chatService: ChatService) {}

  sending: boolean = false;
  message: string = '';

  send(){
    if(this.sending) return;
    this.sending = true;
    this.chatService.send(this.message);
    this.message = '';

    setTimeout(() => {
      this.sending = false;
    },2000);
  }
}
