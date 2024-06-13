import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {ChatInputComponent} from "@components/chat-input/chat-input.component";
import Message from "@models/Message";
import {ChatMessageComponent} from "@components/chat-message/chat-message.component";
import {NgIf} from "@angular/common";
import {ChatService} from "@services/chat.service";
import {NavbarComponent} from "@components/navbar/navbar.component";

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [
    ChatInputComponent,
    ChatMessageComponent,
    NgIf,
    NavbarComponent
  ],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.css'
})
export class ChatViewComponent implements AfterViewChecked{

  @ViewChild('chatView') private myScrollContainer?: ElementRef;

  constructor(protected readonly chatService : ChatService) { }

  scrollToBottom(): void {
    try {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer!.nativeElement.scrollHeight;
    } catch(err) {
      console.error(err);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

}
