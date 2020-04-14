import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private socket: Socket) {
    this.socket.on('message', data => {
      console.log(data);
    });
  }
}
