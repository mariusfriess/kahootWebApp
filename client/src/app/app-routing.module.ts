import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { CreateComponent } from './components/create/create.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { GameHostComponent } from './components/game-host/game-host.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },{
    path: 'start',
    component: StartGameComponent,
  },{
    path: 'start/:id',
    component: GameHostComponent
  },{
    path: 'create',
    component: CreateComponent
  },{
    path: 'game/:id',
    component: GameComponent
  },{
    path: '**',
    redirectTo: ''
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
