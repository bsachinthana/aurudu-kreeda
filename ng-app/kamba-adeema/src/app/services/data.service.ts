import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

const Teams = {
  ASGARD : {
    name: 'Asgard',
    logo: 'asgard.png'
  },
  DISTRICT : {
    name: 'District X',
    logo: 'district.png'
  },
  GOTHAM : {
    name: 'Gotham',
    logo: 'gotham.png'
  },
  HOGWARTS : {
    name: 'Hogwarts',
    logo: 'hogwarts.png'
  },
  QUANTUM : {
    name: 'Quantum',
    logo: 'quantum.png'
  },
  SMALLVILLE : {
    name: 'Smallville',
    logo: 'smallville.png'
  }
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSubject: Subject<any> = new Subject();
  constructor(private socket: Socket) {
    this.socket.on('message', data => {
      this.messageSubject.next(data);
      //console.log(data);
    });
  }

  get messageObservable(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  joinGame(id, name) {
    this.socket.emit('joinGame', { gameId: id, name, connection: 'join' });
  }

  startGame(name, teamNames) {
    console.log(teamNames);
    this.socket.emit('joinGame', { name, connection: 'host', teamNames: teamNames});
  }

  sendGameData(data) {
    this.socket.emit('GameData', data);
  }

  get teams(){
    return Teams;
  }
}
