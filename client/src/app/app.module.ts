import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MaterialModule } from './core/module/material.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './core/service/socket.service';
import { CreateComponent } from './components/create/create.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { GameHostComponent } from './components/game-host/game-host.component';

const config: SocketIoConfig = { url: 'http://192.168.178.39:5000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    CreateComponent,
    StartGameComponent,
    GameHostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MaterialModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
