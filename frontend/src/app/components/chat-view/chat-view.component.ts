import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatInputComponent} from "@components/chat-input/chat-input.component";
import {ChatMessageComponent} from "@components/chat-message/chat-message.component";
import {NgIf} from "@angular/common";
import {ChatService} from "@services/chat.service";
import {NavbarComponent} from "@components/navbar/navbar.component";
import {Subscription} from "rxjs";
import {HistoryService} from "@services/history.service";

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

  constructor(protected readonly chatService : ChatService, private readonly historyService: HistoryService) { }

  scrollToBottom(): void {
    try {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer!.nativeElement.scrollHeight;
    } catch(err) {
      console.error(err);
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.chatService.newResponse.subscribe(() => {
      const currentMessageGroup = this.chatService.messagesGroup.find(group => group.id === this.chatService.currentGroupId);
      const indexOfCurrentMessageGroup = this.chatService.messagesGroup.indexOf(currentMessageGroup!);
      if(currentMessageGroup && indexOfCurrentMessageGroup !== -1){
        currentMessageGroup.lastUpdate = new Date();
        currentMessageGroup.messages = [...this.chatService.messages];
        this.chatService.messagesGroup[indexOfCurrentMessageGroup] = currentMessageGroup;
        localStorage.setItem('messagesGroup', JSON.stringify(this.chatService.messagesGroup));
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
    }));
    this.chatService.currentGroupId = this.chatService.messagesGroup[this.chatService.messagesGroup.length - 1].id + 1;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

}
