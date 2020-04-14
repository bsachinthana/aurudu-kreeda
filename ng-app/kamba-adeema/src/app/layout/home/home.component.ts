import { DataService } from './../../services/data.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  name = '';
  code = '';
  isConnected = false;
  playerSide = '';
  gameObj;
  messages: Observable<any>;
  progressStyle = '1%';

  last = Date.now();
  diff = 16666;
  cps = 1000;

  idleMouseCheckInterval;

  private gameDataSubject: Subject<number> = new Subject();

  constructor(private ds: DataService) {
    this.messages = this.ds.messageObservable;
    this.messages.subscribe(x => {
      this.resolveMessages(x);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.idleMouseCheckInterval = setInterval(() => {this.checkMouseIdle(); }, 250);
  }

  startGame() {
    this.ds.startGame(this.name);
  }

  joinGame() {
    this.ds.joinGame(this.code, this.name);
  }

  resolveMessages(msg: any) {
    switch (msg.status) {
      case 'JoinSuccess':
        this.isConnected = true;
        this.code = msg.data.player.id;
        this.playerSide = msg.data.player.side;
        console.log(this.playerSide);
        this.gameObj = msg.data.gameStatus;
        break;
      case 'GameDataUpdate':
        this.gameDataSubject.next(msg.score);
        break;
      case 'GameEnd':
        clearInterval(this.idleMouseCheckInterval);
        break;
      case 'PlayerAdded':
        this.gameObj = msg.gameStatus;
    }
  }

  getGameDataSubject() {
    return this.gameDataSubject.asObservable();
  }

  click() {
    this.diff = Date.now() - this.last;
    this.last = Date.now();
    let percent = Math.round(this.cps / this.diff);
    if (percent > 100) { percent = 100; }
    this.progressStyle = `${percent}%`;
    console.log(percent);
    this.ds.sendGameData({
      gameId: this.code,
      side: this.playerSide,
      rate: percent / 3
    });
  }

  checkMouseIdle() {
    const percent = Math.round(this.cps / this.diff);
    if ((Date.now() - this.last) > 250) {
      this.diff += 250;
      this.progressStyle = `${percent}%`;
      console.log(percent);
    }
  }
}
