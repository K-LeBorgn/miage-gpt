import {Component} from '@angular/core';
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

  constructor(protected readonly chatService: ChatService) {}

  sending: boolean = false;
  message: string = '';
  showCommands: boolean = false;
  commands: string[] = ['chat', 'image', 'speech'];
  command? : string
  newCommand: string = ''
  stopAddingSpace : boolean = false

  onKeyUp(input:HTMLInputElement, event: KeyboardEvent) {
    if(!this.message.startsWith('/')){
      this.showCommands = false;
      this.newCommand = ''
      this.stopAddingSpace = false;
    }

    const isCommand = this.commands.some(command => this.message.split(' ')[0] == '/' + command);

    if (this.message.startsWith('/') && !isCommand) {
      this.showCommands = true;
      const splitedParts = this.message.split('/')
      if(!this.stopAddingSpace){
        if(splitedParts[1] !== ''){
          this.message = '/' + ' ' + splitedParts[1];
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(1, 1);
          }, 50)
          input.focus();
          input.setSelectionRange(1, 1);
        }
        this.stopAddingSpace = true;
      }
      this.newCommand = this.message.split(' ')[0]
    } else if(isCommand){
      this.command = this.message.split(' ')[0];
      if(this.commands.some(command => '/'+command === this.command)){
        this.showCommands = false;
      }
    }
  }

  send(){
    if(this.sending || this.chatService.loading) return;
    let messageToSend = "";
    this.sending = true;
    if(this.command) messageToSend = this.message.split(this.command)[1]
    else messageToSend = this.message;

    this.chatService.setCommand(this.command);
    this.chatService.send(messageToSend);
    this.message = '';

    setTimeout(() => {
      this.sending = false;
    },2000);
  }

  selectCommand(command: string) {
    this.command = command;
    if(this.commands.some(command => command === this.command)){
      this.showCommands = false;
      if(this.newCommand !== ''){
        this.newCommand = this.newCommand.replace(/\s+/g, '');
        const splitedMessage = this.message.split(this.newCommand);
        if(splitedMessage.length ===1){
          this.message = '/'+command + ' ';
        }
        else{
          this.message = '/'+command + ' ' + splitedMessage[1];
        }
      }
      else {
        this.message = '/'+command + ' ' + this.message.split(this.newCommand)[1];
      }
    }
  }
}
