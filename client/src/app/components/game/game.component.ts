import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/service/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private socket: SocketService, private router: Router) { }

  ngOnInit() {
    console.log(this.socket.connectedGame)
    if(this.socket.connectedGame == undefined) {
      let url = this.router.url;
      let gameCode = parseInt(url.split('/game/')[1]);
      this.socket.findGame(gameCode).then(res => {
        if(!res) this.router.navigate([''])
      })
    }
  }

}
