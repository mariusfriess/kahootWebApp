import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/service/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private socket: SocketService, private router: Router) { }

  ngOnInit() {
  }

  startGame(event: Event, code){
    event.preventDefault();
    this.socket.findGame(code).then(res => {
      if(res) this.router.navigate(['game/' + code])
    });
  }

}
