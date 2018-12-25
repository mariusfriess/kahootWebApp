import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  playerCount: number = 0;
  connectedGame: number;

  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      console.log('Connected to Websocket')
    })
    
    this.socket.on('playerCountChange', (data) => {
      this.playerCount = data.playerCount;
    })
  }

  findGame(code: number): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.socket.emit('findGame', {code});
      this.socket.on('findGameRes', (data) => {
        if(data.gameFound) this.connectedGame = code;
        resolve(data.gameFound)
      })
    })
  }

  createGame(code: number){
    return new Promise((resolve, reject) => {
      this.socket.emit('createGame', {code});
      this.socket.on('createGameRes', (data) => {
        resolve(data)
      })
    })
  }

  checkQuizName(name: string){
    return new Promise((resolve, reject) => {
      this.socket.emit('checkQuizName', {name});
      this.socket.on('checkQuizNameRes', (data) => {
        resolve(data)
      })
    })
  }

  createNewQuiz(quizName: string, questions: Array<any>){
    return new Promise((resolve, reject) => {
      this.socket.emit('createNewQuiz', {quizName, questions});
      this.socket.on('createNewQuizRes', (data) => {
        resolve(data.res)
      })
    })
  }

  searchForQuizzes(name: string){
    return new Promise((resolve, reject) => {
      this.socket.emit('searchForQuizzes', {name});
      this.socket.on('searchForQuizzesRes', (data) => {
        resolve(data.res)
      })
    })
  }

  getQuiz(quizName: string){
    return new Promise((resolve, reject) => {
      this.socket.emit('getQuiz', {quizName});
      this.socket.on('getQuizRes', (data) => {
        resolve(data.res)
      })
    })
  }

}
