import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  open: boolean = false;

  constructor() { }

  toggle() {
    this.open = !this.open;
  }
}
