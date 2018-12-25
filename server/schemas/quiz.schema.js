var mongoose = require('mongoose');

var QuizSchema = new mongoose.Schema(
  {
    name: String,
    questions: [
      {
        title: String,
        correctAnswer: [Number],
        answers: [{
          title: String,
          isCorrect: Boolean
        }]
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Quiz', QuizSchema, 'quizzes');