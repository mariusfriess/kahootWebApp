import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/service/socket.service';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss']
})
export class StartGameComponent implements OnInit {

  nameExisting: boolean = null;
  selectBoxExpand: number = -1;

  quizzes = []
  allQuizzes = []

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.searchQuizName("")
  }

  checkQuizName(_name: string){
    let name = _name.trim()
    if(name == "") {
      this.nameExisting = null;
    }else{
      this.socket.checkQuizName(name).then((data) => {
        console.log(data)
        this.nameExisting = data['existing'];
      })
    }
  }

  createNewQuiz(event: Event, name: string){
    event.preventDefault();
    console.log(name)
  }

  selectBoxClicked(index){
    if(this.selectBoxExpand == index){
      this.selectBoxExpand = -1;
    }else{
      this.selectBoxExpand = index;
    }
  }

  prevSearch;
  searchQuizName(_name: string){
    let name = _name.trim()
    if(this.prevSearch == name) return;
    if(name == "") {
      if(this.allQuizzes.length > 0) {
        this.quizzes = this.allQuizzes
        return;
      }
    }
    this.prevSearch = name;
    this.socket.searchForQuizzes(name).then((data: Array<any>) => {
      console.log(data)
      this.quizzes = data;
    })
  }
}
