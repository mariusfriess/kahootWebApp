import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/service/socket.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private socket: SocketService) { }

  ngOnInit() { }
  
  createGame(event: Event, code){
    event.preventDefault()
    this.socket.createGame(code).then(res => console.log(res))
  }

}
