document.addEventListener('DOMContentLoaded', function () {
  let currentQuestionIndex = 0;
  let score = 0;

  function displayQuestion(data) {
    const container = document.querySelector('.container');
    const element = data[currentQuestionIndex];

    const question_number = document.createElement('h1');
    question_number.textContent = 'Question ' + (currentQuestionIndex + 1) + ' of ' + data.length;
    container.appendChild(question_number);

    const question = document.createElement('h1');
    question.textContent = element.question;
    container.appendChild(question);

    const answers = document.createElement('div');
    answers.setAttribute('id', 'answers');


    const allAnswers = [
      { answer: element.correctAnswer, isCorrect: true },
      ...element.incorrectAnswers.map(answer => ({ answer, isCorrect: false }))
    ];


    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }
    var name = 'answer' + currentQuestionIndex;


    allAnswers.forEach(answerObj => {
      const answerElement = document.createElement('input');
      answerElement.setAttribute('type', 'radio');
      answerElement.setAttribute('name', name);
      answerElement.setAttribute('value', answerObj.isCorrect);
      const label = document.createElement('label');
      label.textContent = answerObj.answer;
      answers.appendChild(answerElement);
      answers.appendChild(label);
      answers.appendChild(document.createElement('br'));
    });

    container.appendChild(answers);

    const submit = document.getElementById('submit');
    submit.addEventListener('click', function () {
      const container = document.querySelector('.container');
      const radios = document.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        if (radio.checked) {
          if (radio.value == 'true') {
            score++;
          }
          currentQuestionIndex++;

          container.innerHTML = '';

          if (currentQuestionIndex < data.length) {
            displayQuestion(data);
          } else {
            const scorediv = document.getElementById('score1');
            scorediv.textContent = 'Your Score: ' + score;
          }
        }
      });
    });
  }



  const reset = document.getElementById('Reset');
  reset.addEventListener('click', function () {
    const container = document.querySelector('.container');
    //get new questions
    fetch('https://the-trivia-api.com/api/questions')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('API request failed');
        }
      })
      .then(data => {
        //restart the game
        container.innerHTML = '';
        currentQuestionIndex = 0;
        score = 0;
        const scorediv = document.getElementById('score1');
        scorediv.textContent = '';

        //display new questions
        displayQuestion(data);
      })
      .catch(error => {
        console.error(error);
      });


  });

  const startButton = document.getElementById('start');
  startButton.addEventListener('click', function () {
    fetch('https://the-trivia-api.com/api/questions')
      .then(response => {
        if (response.ok) {
          const submit = document.getElementById('submit');
          submit.style.visibility = 'visible';

          const reset = document.getElementById('Reset');
          reset.style.visibility = 'visible';

          //delete start button
          const start = document.getElementById('start');
          start.style.visibility = 'hidden';


          return response.json();
        } else {
          throw new Error('API request failed');
        }
      })
      .then(data => {
        displayQuestion(data);
      })
      .catch(error => {
        console.error(error);
      });
  });

});