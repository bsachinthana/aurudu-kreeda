import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Square } from './square';
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
  pixelsPerUnit;

  constructor(private ngZone: NgZone) {

  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.pixelsPerUnit = Math.round(this.ctx.canvas.width / (2 * 300));
    console.log(this.pixelsPerUnit);
    if (this.pixelsPerUnit === 0) { this.pixelsPerUnit = 1; }
  }

  ngAfterViewInit() {
    this.square = new Square(this.ctx);
    this.changeValue.subscribe(val => {
      this.requestId = this.ngZone.runOutsideAngular(() => this.tick(val));
    });
  }

  tick(value) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const width = (this.ctx.canvas.width / 2);
    console.log(value, width, value*width);
    return requestAnimationFrame(() => this.square.moveTo(value * width));
  }

  playRight() {
    this.requestId = this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => this.tick('left')));
  }

  playLeft() {
    this.requestId = this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => this.tick('right')));
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.requestId);
  }
}
