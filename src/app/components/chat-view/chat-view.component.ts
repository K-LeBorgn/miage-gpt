import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {SidebarService} from "@services/sidebar.service";
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

  messages : Message[] = [
    {role: 'assistant', content: 'Hello! How can I help you today?'},
    {role: 'user', content: 'I have a question about my account.'},
    {role: 'assistant', content: 'Sure, I can help with that. What would you like to know?'},
    {role: 'user', content: 'I would like'},
    {role: 'assistant', content: 'I am sorry, I did not understand that. Could you please rephrase your question?'},
    {role: 'user', content: 'I would like to know my account balance.'},
    {role: 'assistant', content: 'I can help with that. Could you please provide me with your account number?'},
    {role: 'user', content: 'Sure, my account number is 123456789.'},
    {role: 'assistant', content: 'Thank you. Your account balance is $500.00.'},
    {role: 'user', content: 'Thank you for your help.'},
    {role: 'assistant', content: 'You are welcome. Have a great day!'},
    {role: 'user', content: 'Goodbye.'},
    {role: 'assistant', content: 'Goodbye.'}
  ];

  constructor(protected readonly sidebarService : SidebarService, protected readonly chatService : ChatService) { }

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
