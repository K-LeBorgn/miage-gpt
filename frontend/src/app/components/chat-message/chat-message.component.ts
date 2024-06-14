import {Component, Input} from '@angular/core';
import Message from "@models/Message";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {

  @Input() message?: Message;
  @Input() type: 'chat' | 'img' | 'speech' = 'chat'
}
