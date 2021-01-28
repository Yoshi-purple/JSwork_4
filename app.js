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

  // 変数を定義
  let val = 0;
  let correctVal = 0;

  // 開始ボタンのイベント
  btnStart.addEventListener('click', async () => {
    await getQuiz(val);
  });

  // 非同期処理
  async function getQuiz(val) {
    head.textContent = '取得中';
    question.textContent = '少々お待ちください。';
    btnsDiv.removeChild(btnStart);
    await callAPI(val);
  }

  // API呼び出し
  async function callAPI(val) {
    let response;
    try {
      response = await fetch(
        'https://opentdb.com/api.php?amount=10&type=multiple'
      );
    } catch (e) {
      console.error(e);
    }
    const quiz = await response.json();

    const quizResult = quiz.results;
    // クイズを表示する関数
    function callQuiz(val) {
      // console.log(quizResult);
      question.textContent = quizResult[val].question;

      // headの書き換え
      head.textContent = `問題${val + 1}`;

      // ジャンル、難易度の書き換え
      genre.textContent = `[ジャンル] ${quizResult[val].category}`;
      difficult.textContent = `[難易度] ${quizResult[val].difficulty}`;
    }

    // 回答ボタンを追加の関数
    function addAns() {
      quizResult[val].incorrect_answers.push(quizResult[val].correct_answer);
      // 配列のシャッフル
      let array = quizResult[val].incorrect_answers;
      let newArray = [];
      function shuffle() {
        while (array.length > 0) {
          let n = array.length;
          let k = Math.floor(Math.random() * n);

          newArray.push(array[k]);
          array.splice(k, 1);
        }
        return newArray;
      }
      shuffle();
      for (let i = 0; i < newArray.length; i++) {
        const selectBtns = document.createElement('button');
        selectBtns.className = 'answer';
        selectBtns.innerText = `${newArray[i]}`;

        if (selectBtns.innerText === quizResult[val].correct_answer) {
          selectBtns.id = 'correctAnswer';
        }
        btnsDiv.appendChild(selectBtns);
      }
      //  コンソールで確認
      console.log(array.length);
      console.log(array);
      console.log(newArray);

      // 回答した時の関数
      const ansBtn = document.querySelectorAll('.answer');
      for (let i = 0; i < ansBtn.length; i++) {
        ansBtn[i].addEventListener('click', (e) => {
          const targetBtn = e.target;
          const parent = targetBtn.parentElement;
          while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
          }
          if (targetBtn.id === 'correctAnswer') {
            correctVal++;
          }
          if (val === 9) {
            head.textContent = `あなたの正答数は${correctVal}です！`;
            question.textContent =
              'もう一度チャレンジしたい場合は以下のボタンをクリック';
            genre.textContent = '';
            difficult.textContent = '';
            const homeBtn = document.createElement('button');
            homeBtn.innerText = 'ホームに戻る';
            homeBtn.id = 'goHome';
            btnsDiv.appendChild(homeBtn);
            // ホームに戻るイベント
            homeBtn.addEventListener('click', () => {
              btnsDiv.removeChild(btnsDiv.lastChild);
              head.textContent = 'ようこそ';
              question.textContent = '以下のボタンをクリック';
              genre.textContent = '';
              difficult.textContent = '';
              correctVal = 0;
              btnsDiv.appendChild(btnStart);
            });
          }
          val++;
          callQuiz(val);
          addAns();
        });
      }
    }

    callQuiz(val);
    addAns();
  }
}
