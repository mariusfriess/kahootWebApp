import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/core/service/socket.service';

@Component({
  selector: 'app-game-host',
  templateUrl: './game-host.component.html',
  styleUrls: ['./game-host.component.scss']
})
export class GameHostComponent implements OnInit {

  quiz;

  constructor(private socket: SocketService, private router: Router) { }

  ngOnInit() {
    let quizName = decodeURI(this.router.url.split('/start/')[1]);
    this.socket.getQuiz(quizName).then((data) => {
      if(data == null || data == undefined) this.router.navigate(['/'])
      else this.quiz = data;
      console.log(this.quiz)
    })
  }

}
