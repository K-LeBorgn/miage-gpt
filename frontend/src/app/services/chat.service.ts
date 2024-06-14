import {EventEmitter, Injectable, Output} from '@angular/core';
import Message from "@models/Message";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  newResponse = new EventEmitter<boolean>();

  attachments: {id:number, src: string, file: File}[] = [];
  loadingIndexes = [1,2,3];
  loading = false;
  command? : '/chat' | '/image' | '/speech' | '/vision';

  messages : Message[] = [];

  messagesGroup: {id: number, title:string, lastUpdate : Date, messages: Message[]}[] = [
    {id:1, title:"New chat 1", lastUpdate: new Date(), messages: [...this.messages]}
  ];

  todayHistory: {groups: {id?:number, title?:string,lastUpdate?: Date, messages?: Message[]}[]} = {groups: []};
  yesterdayHistory: {groups: {id?:number, title?:string, messages?: Message[]}[]} = {groups: []};
  olderHistory: {groups: {id?:number, title?:string, messages?: Message[]}[]} = {groups: []};

  constructor(private readonly httpClient : HttpClient) { }

  send(message: string){
    const imgSources : string[] = [];
    for (let attachment of this.attachments){
      imgSources.push(attachment.src);
    }
    //this.messages.push({id: this.messages.length + 1,role: 'user', content: message, type:'vision', img: imgSources}); // delete it after uncommenting the following code
    switch (this.command){
      case '/chat':
      case '/image':
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
    this.loading = true;
    let url : string = "http://localhost:8080"+this.command;
    console.log(url)

    switch (this.command){
      case '/chat':
      case '/image':
        this.httpClient.post(url, {prompt: message}).subscribe((data) => {
          this.loading = false;
          this.messages.push(this.treatResult(data));
          this.newResponse.emit(true);
        });
        break;
      case '/speech':
        this.httpClient.post(url, {prompt: message},{ responseType: 'blob' }).subscribe((data) => {
          this.loading = false;
          this.messages.push({id: this.messages.length + 1,role: 'assistant', content: window.URL.createObjectURL(data), type:'speech'});
          this.newResponse.emit(true);
        });
        break;
      case '/vision':
        const imgSources : string[] = [];
        for (let attachment of this.attachments){
          imgSources.push(attachment.src);
        }
        this.httpClient.post("http://localhost:8080/vision", {images: imgSources, prompt: message}).subscribe((data) => {
          console.log(data)
          this.loading = false;
          this.attachments = [];
          this.messages.push(this.treatResult(data));
          this.newResponse.emit(true);
        });
        break;
    }
  }

  formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(); // Format the date as needed
    }
  }

  getHistory(){
    this.todayHistory = {groups: []};
    this.yesterdayHistory = {groups: []};
    this.olderHistory = {groups: []};

    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.messagesGroup.forEach(group => {
      let date = new Date(group.lastUpdate);
      let formattedDate = this.formatDate(date);

      if (formattedDate === "Today") {
        this.todayHistory.groups.push(group);
      } else if (formattedDate === "Yesterday") {
        this.yesterdayHistory.groups.push(group);
      } else {
        this.olderHistory.groups.push(group);
      }
    });
  }

  setCommand(command : string | undefined){
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
      case '/chat': return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'chat'};
      case '/image': return {id: this.messages.length + 1,role: 'assistant', content: data.data[0].url, type:'img'};
      case '/speech': return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].content, type:'chat'};
      case '/vision': return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'vision'};
      default : return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'chat'};
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
}
