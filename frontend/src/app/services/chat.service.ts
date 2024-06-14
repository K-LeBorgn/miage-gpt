import { Injectable } from '@angular/core';
import Message from "@models/Message";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  loadingIndexes = [1,2,3];
  loading = false;
  command? : '/chat' | '/image' | '/speech'

  messages : Message[] = [
    {id:1, role: 'assistant', content: 'Hello! How can I help you today?', type:'chat'},
    {id:2, role: 'user', content: 'I have a question about my account.', type:'chat'},
    {id:3, role: 'assistant', content: 'Sure, I can help with that. What would you like to know?', type:'chat'},
    {id:4, role: 'user', content: 'I would like', type:'chat'},
    {id:5, role: 'assistant', content: 'I am sorry, I did not understand that. Could you please rephrase your question?', type:'chat'},
    {id:6, role: 'user', content: 'I would like to know my account balance.', type:'chat'},
    {id:7, role: 'assistant', content: 'I can help with that. Could you please provide me with your account number?', type:'chat'},
    {id:8, role: 'user', content: 'Sure, my account number is 123456789.', type:'chat'},
    {id:9, role: 'assistant', content: 'Thank you. Your account balance is $500.00.', type:'chat'},
    {id:10, role: 'user', content: 'Thank you for your help.', type:'chat'},
    {id:11, role: 'assistant', content: 'You are welcome. Have a great day!', type:'chat'},
    {id:12, role: 'user', content: 'Goodbye.', type:'chat'},
    {id:13, role: 'assistant', content: 'Goodbye.', type:'chat'}
  ];

  messagesGroup: {id: number, title:string, lastUpdate : Date, messages: Message[]}[] = [
    {id:1, title:"Account balance", lastUpdate: new Date(), messages: [...this.messages]}
  ];

  todayHistory: {groups: {id?:number, title?:string,lastUpdate?: Date, messages?: Message[]}[]} = {groups: []};
  yesterdayHistory: {groups: {id?:number, title?:string, messages?: Message[]}[]} = {groups: []};
  olderHistory: {groups: {id?:number, title?:string, messages?: Message[]}[]} = {groups: []};

  constructor(private readonly httpClient : HttpClient) { }

  send(message: string){
    this.messages.push({id: this.messages.length + 1,role: 'user', content: message, type:'chat'});
    this.loading = true;
    let url : string = "http://localhost:8080"+this.command;
    console.log(url)

    this.httpClient.post(url, { prompt: message}).subscribe((data) => {
      this.loading = false;
      this.messages.push(this.treatResult(data));
    })
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
    console.log("command",command)

    switch (command){
      case '/chat': this.command = command; break;
      case '/image': this.command = command; break;
      case '/speech': this.command = command; break;
      default: this.command = '/chat'; break;
    }
  }

  treatResult(data : any) : Message{
    switch (this.command){
      case '/chat': return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'chat'};
      case '/image': return {id: this.messages.length + 1,role: 'assistant', content: data.data[0].url, type:'img'};
      case '/speech': return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].content, type:'chat'};
      default : return {id: this.messages.length + 1,role: 'assistant', content: data.choices[0].message.content, type:'chat'};
    }
  }
}
