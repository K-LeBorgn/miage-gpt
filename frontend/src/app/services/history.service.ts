import { Injectable } from '@angular/core';
import {ChatService} from "@services/chat.service";
import Message from "@models/Message";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  todayHistory: {groups: {id?:number, title?:string,lastUpdate?: Date, messages?: Message[]}[]} = {groups: []};
  yesterdayHistory: {groups: {id?:number, title?:string,lastUpdate?: Date, messages?: Message[]}[]} = {groups: []};
  olderHistory: {groups: {id?:number, title?:string,lastUpdate?: Date, messages?: Message[]}[]} = {groups: []};

  constructor(private readonly chatService : ChatService) { }

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

    this.chatService.messagesGroup.forEach(group => {
      let date = new Date(group.lastUpdate);
      let formattedDate = this.formatDate(date);

      if (formattedDate === "Today") {
        this.todayHistory.groups.push(group);
      } else if (formattedDate === "Yesterday") {
        this.yesterdayHistory.groups.push(group);
      } else {
        this.olderHistory.groups.push(group);
      }

      this.todayHistory.groups.sort((a, b) => {
        return new Date(b.lastUpdate!).getTime() - new Date(a.lastUpdate!).getTime();
      });
      this.yesterdayHistory.groups.sort((a, b) => {
        return new Date(b.lastUpdate!).getTime() - new Date(a.lastUpdate!).getTime();
      });
      this.olderHistory.groups.sort((a, b) => {
        return new Date(b.lastUpdate!).getTime() - new Date(a.lastUpdate!).getTime();
      });
    });
  }

  changeConversation(groupId: number){
    if(this.chatService.loading) return;
    this.chatService.currentGroupId = groupId;
    this.chatService.messages = this.chatService.messagesGroup.find(group => group.id === groupId)?.messages || [];
  }
}
