import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSubject: Subject<any> = new Subject();
  constructor(private socket: Socket) {
    this.socket.on('message', data => {
      this.messageSubject.next(data);
      console.log(data);
    });
  }

  get messageObservable(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  joinGame(id, name) {
    this.socket.emit('joinGame', { gameId: id, name, connection: 'join' });
  }

  startGame(name) {
    this.socket.emit('joinGame', { name, connection: 'host' });
  }

  sendGameData(data) {
    this.socket.emit('GameData', data);
  }
}
