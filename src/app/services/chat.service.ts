import { Injectable } from '@angular/core';
import Message from "@models/Message";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  loadingIndexes = [1,2,3];
  loading = false;

  messages : Message[] = [
    {id:1, role: 'assistant', content: 'Hello! How can I help you today?'},
    {id:2, role: 'user', content: 'I have a question about my account.'},
    {id:3, role: 'assistant', content: 'Sure, I can help with that. What would you like to know?'},
    {id:4, role: 'user', content: 'I would like'},
    {id:5, role: 'assistant', content: 'I am sorry, I did not understand that. Could you please rephrase your question?'},
    {id:6, role: 'user', content: 'I would like to know my account balance.'},
    {id:7, role: 'assistant', content: 'I can help with that. Could you please provide me with your account number?'},
    {id:8, role: 'user', content: 'Sure, my account number is 123456789.'},
    {id:9, role: 'assistant', content: 'Thank you. Your account balance is $500.00.'},
    {id:10, role: 'user', content: 'Thank you for your help.'},
    {id:11, role: 'assistant', content: 'You are welcome. Have a great day!'},
    {id:12, role: 'user', content: 'Goodbye.'},
    {id:13, role: 'assistant', content: 'Goodbye.'}
  ];

  messagesGroup: {id: number, title:string, lastUpdate : Date, messages: Message[]}[] = [
    {id:1, title:"Account balance", lastUpdate: new Date(), messages: [
      {id:1, role: 'assistant', content: 'Hello! How can I help you today?'},
      {id:2, role: 'user', content: 'I have a question about my account.'},
      {id:3, role: 'assistant', content: 'Sure, I can help with that. What would you like to know?'},
      {id:4, role: 'user', content: 'I would like'},
      {id:5, role: 'assistant', content: 'I am sorry, I did not understand that. Could you please rephrase your question?'},
      {id:6, role: 'user', content: 'I would like to know my account balance.'},
      {id:7, role: 'assistant', content: 'I can help with that. Could you please provide me with your account number?'},
      {id:8, role: 'user', content: 'Sure, my account number is 123456789.'},
      {id:9, role: 'assistant', content: 'Thank you. Your account balance is $500.00.'},
      {id:10, role: 'user', content: 'Thank you for your help.'},
      {id:11, role: 'assistant', content: 'You are welcome. Have a great day!'},
      {id:12, role: 'user', content: 'Goodbye.'},
      {id:13, role: 'assistant', content: 'Goodbye.'}
    ]}
  ];

  todayHistory: {groups: {id?:number, title?:string,lastUpdate?: Date, messages?: Message[]}[]} = {groups: []};
  yesterdayHistory: {groups: {id?:number, title?:string, messages?: Message[]}[]} = {groups: []};
  olderHistory: {groups: {id?:number, title?:string, messages?: Message[]}[]} = {groups: []};

  constructor() { }

  send(message: string){
    this.messages.push({id: this.messages.length + 1,role: 'user', content: message});
    this.loading = true;
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
        this.todayHistory.groups.push(group);
        this.todayHistory.groups.push(group);
        this.yesterdayHistory.groups.push(group);
        this.yesterdayHistory.groups.push(group);
        this.yesterdayHistory.groups.push(group);
        this.olderHistory.groups.push(group);
        this.olderHistory.groups.push(group);
        this.olderHistory.groups.push(group);
      } else if (formattedDate === "Yesterday") {
        this.yesterdayHistory.groups.push(group);
      } else {
        this.olderHistory.groups.push(group);
      }
    });
  }
}
