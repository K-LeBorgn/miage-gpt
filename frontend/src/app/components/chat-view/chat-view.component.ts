import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatInputComponent} from "@components/chat-input/chat-input.component";
import {ChatMessageComponent} from "@components/chat-message/chat-message.component";
import {NgIf} from "@angular/common";
import {ChatService} from "@services/chat.service";
import {NavbarComponent} from "@components/navbar/navbar.component";
import {Subscription} from "rxjs";

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
export class ChatViewComponent implements OnInit, OnDestroy, AfterViewChecked{

  @ViewChild('chatView') private myScrollContainer?: ElementRef;

  subscriptions : Subscription[] = [];

  constructor(protected readonly chatService : ChatService) { }

  scrollToBottom(): void {
    try {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer!.nativeElement.scrollHeight;
    } catch(err) {
      console.error(err);
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.chatService.newResponse.subscribe(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

}
