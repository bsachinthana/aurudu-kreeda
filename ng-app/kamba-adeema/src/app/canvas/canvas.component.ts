import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Square } from './Square';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() changeValue: Observable<number>;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  squares: Square[] = [];
  square: Square;

  constructor(private ngZone: NgZone) {

  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    // setInterval(() => {
    //   this.tick();
    // }, 200);
  }

  ngAfterViewInit() {
    this.square = new Square(this.ctx);
    this.changeValue.subscribe(val => {
      if (val > 0) {
        this.playRight();
      } else if (val < 0) {
        this.playLeft();
      }
    });
  }

  tick(side) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (side === 'left') {
      return requestAnimationFrame(() => this.square.moveLeft());
    } else {
      return requestAnimationFrame(() => this.square.moveRight());
    }
  }

  playRight() {
    // this.requestId = this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => this.tick('left')));
    this.requestId = requestAnimationFrame(() => this.tick('left'));
  }

  playLeft() {
    // this.requestId = this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => this.tick('right')));
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.requestId);
  }

}
