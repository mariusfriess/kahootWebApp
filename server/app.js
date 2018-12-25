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

function findQuiz(name) {
  console.log(name)
  return new Promise((resolve, reject) => {
    Quiz.findOne({name}).exec((err, quiz) => {
      if(err){
        console.error(err)
        resolve(false);
      }else if(!quiz){
        console.log('Quiz ' + name + ' not found.')
        resolve(false);
      }else{
        console.log('Quiz ' + name + ' found.')
        resolve(true);
      }
    })
  })
}

// Only returns first 10
function searchForQuizzes(name){
  let regEx = new RegExp(name, 'i')
  return new Promise((resolve, reject) => {
    Quiz.find({name: regEx}, 'name', {limit: 10}, (err, quizzes) => {
      if(err){
        console.error(err)
        resolve(null);
      }else if(!quizzes){
        resolve(null);
      }else{
        resolve(quizzes)
      }
    })
  })
}
/*
function searchForQuizzes(name){
  let firstLetterRegEx = new RegExp('^' + name, 'i')
  let similarWordRegEx = new RegExp(name, 'i')
  let response = [];
  let limit = 10;
  return new Promise((resolve, reject) => {
    Quiz.find({name: firstLetterRegEx}, 'name', {limit}, (err, quizzes) => {
      if(err){
        console.error(err)
        resolve(null);
      }else if(!quizzes){
        resolve(null);
      }else{
        if(quizzes.length == 10){
          resolve(quizzes);
        }else{
          response = quizzes;
          limit -= quizzes.length;
        }
      }
    })
    Quiz.find({name: similarWordRegEx}, 'name', {limit}, (err, quizzes) => {
      if(err){
        console.error(err)
        resolve(null);
      }else if(!quizzes){
        resolve(null);
      }else{
        response = {...response, quizzes}
        resolve(response)
      }
    })
  })
}*/

function getQuiz(name){
  return new Promise((resolve, reject) => {
    Quiz.findOne({name}).exec((err, quiz) => {
      if(err){
        console.error(err)
        resolve(null);
      }else if(!quiz){
        console.log('Quiz ' + name + ' not found.')
        resolve(null);
      }else{
        console.log('Quiz ' + name + ' found.')
        resolve(quiz);
      }
    })
  })
}

function createQuiz(name, questions){
  return new Promise((resolve, reject) => {
    db.collection('quizzes').insertOne({
      name: name,
      questions: questions
    }, (err, quiz) => {
      if(err){
        console.error(err);
        resolve(false);
      }else{
        console.log('Quiz ' + name + ' created');
        resolve(true);
      }
    })
  })
}
/*
createQuiz("Super Quiz", [
  {
    title: "Question 1",
    answers: [{
      title: "Antwort die Erste",
      isCorrect: false
    },{
      title: "Antwort die Zweite",
      isCorrect: false
    },{
      title: "Antwort die Dritte",
      isCorrect: false
    },{
      title: "Antwort die Richtige",
      isCorrect: true
    }]
  },{
    title: "Question 2",
    answers: [{
      title: "Antwort2 die Erste",
      isCorrect: false
    },{
      title: "Antwort2 die Zweite",
      isCorrect: false
    },{
      title: "Antwort2 die Dritte",
      isCorrect: false
    },{
      title: "Antwort2 die Richtige",
      isCorrect: true
    }]
  },{
    title: "Question 3",
    answers: [{
      title: "Antwort3 die Erste",
      isCorrect: false
    },{
      title: "Antwort3 die Zweite",
      isCorrect: false
    },{
      title: "Antwort3 die Dritte Richtige",
      isCorrect: true
    },{
      title: "Antwort3 die Richtige",
      isCorrect: true
    }]
  }
])*/

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

  socket.on('checkQuizName', async (data) => {
    let existing = await findQuiz(data.name);
    console.log('Test' + existing)
    socket.emit('checkQuizNameRes', {existing})
  })

  socket.on('searchForQuizzes', async (data) => {
    let res = await searchForQuizzes(data.name)
    socket.emit('searchForQuizzesRes', {res})
  })

  socket.on('createNewQuiz', async (data) => {
    let res = await createQuiz(data.quizName, data.questions)
    socket.emit('createNewQuizRes', {res})
  })

  socket.on('getQuiz', async (data) => {
    let res = await getQuiz(data.quizName)
    socket.emit('getQuizRes', {res})
  })
})