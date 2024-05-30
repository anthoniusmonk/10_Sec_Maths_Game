$(document).ready(function(){
  var currentQuestion;
  var timeLeft = 10;
  var score = 0;
  var highScore = 0;
  var interval;

  var updateTimeLeft = function (amount) {
    timeLeft += amount;
    $('#time-left').text(timeLeft);
  };

  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
    updateHighScore();
  };

  var updateHighScore = function (amount) {
    if (score > highScore) {
      highScore = score;
      $('#high-score').text(highScore);
    }
  }

  var startGame = function() {
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        updateScore(-score);
      }
      interval = setInterval(function () {
        updateTimeLeft(-1)
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
        }
      }, 1000);
    }
  };

  var randomNumberGenerator = function () {
    return Math.ceil(Math.random() * 10);
  };

  var getSelectedOperators = function () {
    var selectedOperators = [];
    if ($('#addition').is(':checked')) selectedOperators.push('+');
    if ($('#subtraction').is(':checked')) selectedOperators.push('-');
    if ($('#multiplication').is(':checked')) selectedOperators.push('*');
    if ($('#division').is(':checked')) selectedOperators.push('/');
    return selectedOperators;
  }

  var questionGenerator = function () {
    var selectedOperators = getSelectedOperators();
    if (selectedOperators.length === 0) {
      alert('Please select at least one selection type.');
      return;
    }

    var question = {};
    var num1 = randomNumberGenerator(10);
    var num2 = randomNumberGenerator(10);
    var operator = selectedOperators[Math.floor(Math.random() * selectedOperators.length)];

    switch (operator) {
      case '+':
        question.answer = num1 + num2;
        question.equation = String(num1) + " + " + String(num2);
        break;
      case '-':
        if (num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        question.answer = num1 - num2;
        question.equation = String(num1) + " - " + String(num2);
        break;
      case '*':
        question.answer = num1 * num2;
        question.equation = String(num1) + " * " + String(num2);
        break;
      case '/':
        num1 = num1 * num2; // Ensure num1 is a multiple of num2
        question.answer = num1 / num2;
        question.equation = String(num1) + " / " + String(num2);
        break; 
    }

    return question;
  };

  var renderNewQuestion = function () {
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);
  };

  var checkAnswer = function (userInput, answer) {
    if(userInput === answer) {
      renderNewQuestion();
      $('#user-input').val('');
      updateTimeLeft(+1);
      updateScore(+1);
    }
  };

  $('#user-input').on('keyup', function () {
    startGame();
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  renderNewQuestion();

  $('#addition, #subtraction, #multiplication, #division').change(function() {
    renderNewQuestion(); // Update the question when a checkbox is checked/unchecked
  });
});