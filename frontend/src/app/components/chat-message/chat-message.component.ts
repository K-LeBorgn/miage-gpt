import {Component, Input, OnInit} from '@angular/core';
import Message from "@models/Message";
import {NgClass, NgOptimizedImage} from "@angular/common";
import * as marked from 'marked';
import {MarkdownPipe} from "../../pipes/markdown.pipe";

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    MarkdownPipe
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent implements OnInit {

  @Input() message?: Message;
  @Input() type: Message["type"] = 'chat'

  ngOnInit() {
  }
}
