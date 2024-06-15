import {EventEmitter, Injectable, Output} from '@angular/core';
import Message from "@models/Message";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  newResponse = new EventEmitter<boolean>();
  refreshHistory = new EventEmitter<boolean>();

  attachments: {id:number, src: string, file: File}[] = [];
  loadingIndexes = [1,2,3];
  loading = false;
  command? : '/chat' | '/image' | '/speech' | '/vision';

  messages : Message[] = [];

  messagesGroup: {id: number, title:string, lastUpdate : Date, messages: Message[]}[] = JSON.parse(localStorage.getItem('messagesGroup') || '[]');
  currentGroupId = 1;

  constructor(private readonly httpClient : HttpClient) { }

  send(message: string){
    const imgSources : string[] = [];
    for (let attachment of this.attachments){
      imgSources.push(attachment.src);
    }

    const messagesToSend : {role : 'user' | 'assistant', content: string}[] = [];

    switch (this.command){
      case '/chat':
        this.messages.push({id: this.messages.length + 1,role: 'user', content: message, type:'chat'});
        break;
      case '/image':
        this.messages.push({id: this.messages.length + 1,role: 'user', content: message, type:'chat'});
        break;
      case '/speech':
        this.messages.push({id: this.messages.length + 1,role: 'user', content: message, type:'chat'});
        break;
      case '/vision':
        this.messages.push({id: this.messages.length + 1,role: 'user', content: message, type:'vision', img: imgSources});
        break;
      default:
        this.messages.push({id: this.messages.length + 1,role: 'user', content: message, type:'chat'});
        break;
    }

    if (this.messagesGroup.length === 0 || this.messages.length === 1){
      this.messagesGroup.push({id: this.currentGroupId, title: 'New chat ' + this.currentGroupId, lastUpdate: new Date(), messages: this.messages});
      this.refreshHistory.emit(true);
    }
    this.loading = true;
    let url : string = "http://localhost:8080"+this.command;
    console.log(url)

    messagesToSend.push(...this.messages.map(message => {return {role: message.role, content: message.content}}));
    console.log(messagesToSend)

    switch (this.command){
      case '/chat':
        this.httpClient.post(url, {messages: messagesToSend}).subscribe((data) => {
          this.loading = false;
          this.messages.push(this.treatResult(data));
          this.newResponse.emit(true);
          this.refreshHistory.emit(true);

        });
        break;
      case '/image':
        this.httpClient.post(url, {prompt: messagesToSend[messagesToSend.length - 1].content}).subscribe((data) => {
          this.loading = false;
          this.messages.push(this.treatResult(data));
          this.newResponse.emit(true);
          this.refreshHistory.emit(true);

        });
        break;
      case '/speech':
        this.httpClient.post(url, {messages: messagesToSend},{ responseType: 'blob' }).subscribe((data) => {
          this.loading = false;
          this.messages.push({id: this.messages.length + 1,role: 'assistant', content: window.URL.createObjectURL(data), type:'speech'});
          this.newResponse.emit(true);
          this.refreshHistory.emit(true);

        });
        break;
      case '/vision':
        const imgSources : string[] = [];
        for (let attachment of this.attachments){
          imgSources.push(attachment.src);
        }
        this.httpClient.post("http://localhost:8080/vision", {images: imgSources, messages: messagesToSend}).subscribe((data) => {
          console.log(data)
          this.loading = false;
          this.attachments = [];
          this.messages.push(this.treatResult(data));
          this.newResponse.emit(true);
          this.refreshHistory.emit(true);

        });
        break;
    }
  }

  setCommand(command : string | undefined){
    if(this.attachments.length !== 0){
      this.command = '/vision';
      return;
    }
    switch (command){
      case '/chat': this.command = command; break;
      case '/image': this.command = command; break;
      case '/speech': this.command = command; break;
      default:
        if(this.attachments.length === 0) this.command = '/chat';
        else this.command = '/vision';
        break;
    }
  }

  treatResult(data : any) : Message{
    this.attachments = [];

    switch (this.command){
      case '/chat': this.command = undefined; return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'chat'};
      case '/image': this.command = undefined; return {id: this.messages.length + 1,role: 'assistant', content: data.data[0].url, type:'img'};
      case '/speech': this.command = undefined; return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].content, type:'chat'};
      case '/vision': this.command = undefined; return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'vision'};
      default : this.command = undefined; return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'chat'};
    }
  }

  processFile(imageInput: any) {
    if(imageInput.files.length === 0) return;

    for (let file of imageInput.files) {
      if (this.attachments.some(attachment => attachment.file.name === file.name)) continue;
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.attachments.push({id: this.attachments.length + 1, src: event.target.result, file: file});
      });

      reader.readAsDataURL(file);
    }
    imageInput.value = '';
  }

  removeAttachment(id: number){
    this.attachments = this.attachments.filter(attachment => attachment.id !== id);
  }

  removeConversation(id: number){
    if (this.loading) return;
    this.messagesGroup = this.messagesGroup.filter(group => group.id !== id);
    localStorage.setItem('messagesGroup', JSON.stringify(this.messagesGroup));
    this.refreshHistory.emit(true);
  }
}
