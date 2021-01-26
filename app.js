/** @format */

'use strict';
{
  // 要素を取得
  const btnsDiv = document.getElementById('buttons');
  const btnStart = document.querySelector('.btnStart');
  const head = document.querySelector('.header');
  const question = document.querySelector('.question');
  const genre = document.querySelector('.genre');
  const difficult = document.querySelector('.difficult');

  // 開始ボタンのイベント
  btnStart.addEventListener('click', () => {
    getQuiz(0);
  });

  function getQuiz(val) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(val);
      }, 1000);

      head.textContent = '取得中';
      question.textContent = '少々お待ちください。';
      btnsDiv.removeChild(btnStart);
    }).then(() => {
      callAPI(val);
    });
  }

  // API呼び出し
  async function callAPI(val) {
    const response = await fetch(
      'https://opentdb.com/api.php?amount=10&type=multiple'
    );
    const quiz = await response.json();

    const quizResult = quiz.results;
    // クイズを表示する関数
    function callQuiz(val) {
      console.log(quizResult);

      question.textContent = quizResult[val].question;

      // headの書き換え
      head.textContent = `問題${val + 1}`;

      // ジャンル、難易度の書き換え
      genre.textContent = `[ジャンル] ${quizResult[val].category}`;
      difficult.textContent = `[難易度] ${quizResult[val].difficulty}`;
    }

    // 回答ボタンを追加の関数
    function addAns() {
      for (let i = 0; i < quizResult[val].incorrect_answers.length; i++) {
        const selectBtns = document.createElement('button');
        selectBtns.className = 'answer';
        selectBtns.innerText = `${quizResult[val].incorrect_answers[i]}`;
        btnsDiv.appendChild(selectBtns);
      }
    }

    callQuiz(val);
    addAns();

    // 回答した時の関数
    const ansBtn = document.querySelectorAll('.answer');
    for (let i = 0; i < ansBtn.length; i++) {
      ansBtn[i].addEventListener('click', (e) => {
        const targetBtn = e.target;
        const parent = targetBtn.parentElement;
        while (parent.lastChild) {
          parent.removeChild(parent.lastChild);
        }
        val++;

        ansBtn.innerText = `${quizResult[val].incorrect_answers[i]}`;
        console.log(ansBtn[i].innerText);
        callQuiz(val);
        addAns();
      });
    }
  }
}
