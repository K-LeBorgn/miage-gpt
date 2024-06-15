import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {SidebarService} from "@services/sidebar.service";
import {HistoryService} from "@services/history.service";
import {Subscription} from "rxjs";
import {ChatService} from "@services/chat.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy{

  subscriptions : Subscription[] = [];

  constructor(protected readonly sidebarService: SidebarService, protected readonly historyService: HistoryService, protected readonly chatService: ChatService) { }

  ngOnInit() {
    this.historyService.getHistory();
    this.subscriptions.push(this.chatService.refreshHistory.subscribe(() => {
      this.historyService.getHistory();
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
