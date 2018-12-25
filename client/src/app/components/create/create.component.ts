import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/service/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  nameExisting: boolean = null;
  questions = [];

  questionsExample = {
    title: "Question 1",
    correctAnswer: [],
    answers: [
      {
        title: "Answer 1",
        isCorrect: false
      },
      {
        title: "Answer 2",
        isCorrect: false
      },
      {
        title: "Answer 3",
        isCorrect: false
      },
      {
        title: "Answer 4",
        isCorrect: false
      }
    ]
  }

  constructor(private socket: SocketService, private router: Router) { }

  ngOnInit() {
    this.addQuestion();
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

  addQuestion(){
    this.questions.push(this.getQuestionExample());
    this.questions[this.questions.length - 1].title = "Question " + this.questions.length;
  }

  changeIsCorrect(questionIndex, answerIndex, changeTo){
    if(changeTo){
      this.questions[questionIndex].correctAnswer.push(answerIndex)
    }else{
      let index = this.questions[questionIndex].correctAnswer.indexOf(answerIndex);
      this.questions[questionIndex].correctAnswer.splice(index, 1);
    }
    this.questions[questionIndex].answers[answerIndex].isCorrect = changeTo;
  }

  createQuiz(event: Event, quizName){
    event.preventDefault();
    for(let i = 0; i < this.questions.length; i++){
      if(this.questions[i].correctAnswer.length == 0) return
    }
    console.log(quizName)
    console.log(this.questions)
    this.socket.createNewQuiz(quizName, this.questions).then(data => {
      if(data) {
        this.router.navigate(['start/' + quizName])
      }else{
        console.error("Something went wrong")
      }
    })
  }

  setQuestionTitle(qi, qval){
    this.questions[qi].title = qval.trim();
  }

  setAnswerTitle(qi, ai, aval){
    this.questions[qi].answers[ai].title = aval.trim();
  }

  getQuestionExample(){
    return JSON.parse(JSON.stringify(this.questionsExample));
  }

}
