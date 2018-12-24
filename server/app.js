let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mongoose = require('mongoose');

const PORT = 5000;

http.listen(PORT, () => {
  console.log('Started on Port ' + PORT);
});


/***
 * 
 *  MONGO DB 
 * 
 ***/

let Quiz = require('./schemas/quiz.schema');

mongoose.connect('mongodb://localhost:27017/QuizDatabase', {useNewUrlParser: true});
let db = mongoose.connection;
db.once('open', () => {
  console.log('QuizDatabase opened successfully')
})
db.on('error', console.error.bind(console, 'connection error:'))

function findQuiz(name){
  Quiz.findOne({name}).exec((err, quiz) => {
    if(err){
      console.error(err)
      return false;
    }else if(!quiz){
      console.log('Quiz ' + name + ' not found.')
      return false;
    }else{
      console.log('Quiz ' + name + ' found.')
      return true;
    }
  })
}

function getQuiz(name){
  Quiz.findOne({name}).exec((err, quiz) => {
    if(err){
      console.error(err)
      return null;
    }else if(!quiz){
      console.log('Quiz ' + name + ' not found.')
      return null;
    }else{
      console.log('Quiz ' + name + ' found.')
      return quiz;
    }
  })
}

function createQuiz(name, answers){
  db.collection('quizzes').insert({
    name: name,
    answesrs: answers
  }, (err, quiz) => {
    if(err){
      console.error(err);
      return null;
    }else{
      console.log('Quiz ' + name + ' created');
      return quiz;
    }
  })
}

/***
 * 
 *  SOCKET IO
 * 
 ***/

let connected = 0;

io.on('connection', (socket) => {
  let room = 0;
  connected++;
  console.log('User connected: ' + connected);

  socket.on('disconnect', () => {
    connected--;
    console.log('User disconnected: ' + connected)
    if(io.sockets.adapter.rooms[room]){
      io.to(room).emit('playerCountChange', {playerCount: io.sockets.adapter.rooms[room].length})
    }
  })

  // CLIENT REQ CREATE NEW GAME
  socket.on('createGame', (data) => {
    let code = parseInt(data.code);
    if(io.sockets.adapter.rooms[code]){
      // IF ALREADY EXISTS
      socket.emit('createGameRes', {gameCreated: false})
    }else{
      // JOIN CLIENT TO NEW ROOM
      room = code;
      socket.join(code)
      console.log(socket.rooms)
      io.to(code).emit('test', {test: 'test'})
      socket.emit('createGameRes', {gameCreated: true})
    }
  })

  // CHECK IF ROOM EXISTS
  socket.on('findGame', (data) => {
    let code = parseInt(data.code)
    if(io.sockets.adapter.rooms[code]){
      // JOIN CLIENT TO ROOM
      room = code;
      socket.join(code)
      socket.emit('findGameRes', {gameFound: true})
      io.to(code).emit('playerCountChange', {playerCount: io.sockets.adapter.rooms[code].length})
      console.log(io.sockets.adapter.rooms[code])
    }else{
      socket.emit('findGameRes', {gameFound: false})
    }
  });
})