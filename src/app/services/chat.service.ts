import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  loadingIndexes = new Array(3);
  loading = false;

  constructor() { }
}
