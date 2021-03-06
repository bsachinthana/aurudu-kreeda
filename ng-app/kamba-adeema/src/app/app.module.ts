import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CanvasComponent } from './canvas/canvas.component';

import { HomeComponent } from './layout/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './layout/material/material/material.module';
import { GameComponent } from './layout/game/game.component';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { TeamSelectionComponent } from './layout/modals/team-selection/team-selection.component';

const config: SocketIoConfig = { url: `${location.origin}`, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    HomeComponent,
    GameComponent,
    TeamSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
