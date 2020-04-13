import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Square } from './square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'kamba-adeema';

  constructor() {}

  ngOnInit() {
    
  }

}
