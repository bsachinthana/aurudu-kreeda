import { DataService } from './../../services/data.service';
import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  name = '';
  code = '';
  gameStatus = '';
  additionalGameStatus = '';
  isConnected = false;
  isStarted = false;
  playerSide = '';
  gameObj;
  messages: Observable<any>;
  progressStyle = '1%';

  last = Date.now();
  diff = 270;
  cps = 130;

  idleMouseCheckInterval;

  diffArray = [];

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

  }

  startGame() {
    this.ds.startGame(this.name);
  }

  joinGame() {
    this.ds.joinGame(this.code, this.name);
  }

  initGameControls(){
    this.idleMouseCheckInterval = setInterval(() => { this.checkMouseIdle(); }, 250);
  }

  resolveMessages(msg: any) {
    switch (msg.status) {
      case 'JoinSuccess':
        this.isConnected = true;
        this.code = msg.data.player.id;
        this.playerSide = msg.data.player.side;
        this.gameObj = msg.data.gameStatus;
        this.gameStatus = 'Waiting for Other players'
        break;
      case 'GameDataUpdate':
        this.gameDataSubject.next(msg.score);
        break;
      case 'GameEnd':
        clearInterval(this.idleMouseCheckInterval);
        this.isStarted = false;
        this.code = '';
        this.gameStatus = 'Game Over'
        this.additionalGameStatus = `${msg.score < 0 ? 'Left' : 'Right'} Won the Game !!!!`
        break;
      case 'PlayerAdded':
        this.gameObj = msg.gameStatus;
        break;
      case 'GameStart':
        this.gameStatus = 'All players joined... Starting game...'
        break;
      case 'Countdown':
        var count = msg.data;
        this.gameStatus = count.toString();
        if(count ===0){
          this.isStarted = true;
          this.initGameControls();
        }
        break;
      case 'PlayerDisconnected':
        this.gameObj = msg.data.gameStatus;
    }
  }

  getGameDataSubject() {
    return this.gameDataSubject.asObservable();
  }

  click() {
    if (this.diffArray.length > 7) {
      this.diffArray = this.diffArray.slice(1, this.diffArray.length);
    }
    this.diffArray.push(Math.min(27000, Date.now() - this.last));
    this.last = Date.now();
  }

  checkMouseIdle() {
    if ((Date.now() - this.last) >= 250) {
      if (this.diffArray.length > 7) {
        this.diffArray = this.diffArray.slice(1, this.diffArray.length);
      }
      this.diffArray.push(Math.min(27000, Date.now() - this.last));
    }
    this.calculateAndSendGameData();
  }

  calculateAndSendGameData() {
    const avgDiff = this.diffArray.reduce((prev, cur) => prev + cur, 0) / this.diffArray.length;
    let percent = Math.round(this.cps / avgDiff * 100);

    if (percent > 100) {
      percent = 100;
    }

    this.progressStyle = `${percent}%`;
    this.ds.sendGameData({
      gameId: this.code,
      side: this.playerSide,
      rate: percent / 3
    });
  }
}
