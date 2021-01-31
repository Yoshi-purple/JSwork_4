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
    // 配列に追加
    function pushAns() {
      quizResult[val].incorrect_answers.push(quizResult[val].correct_answer);
    }
    pushAns();

    const ansLen = quizResult[val].incorrect_answers.length;

    console.log(quizResult[val]);

    // クイズを表示する関数
    class Quiz {
      constructor(obj) {
        const _obj = obj;
        this.getObj = function () {
          return _obj;
        };

        pushAns();
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
        console.log(_obj);
        console.log(quizResult[val].correct_answer);

        head.textContent = `問題${val + 1}`;
        question.textContent = `${this.getObj.question}`;
        difficult.textContent = `【難易度】${this.getObj.difficulty}`;
        genre.textContent = `【ジャンル】${this.getObj.category}`;

        while (btnsDiv.lastChild) {
          btnsDiv.removeChild(btnsDiv.lastChild);
        }

        for (let i = 0; i < ansLen; i++) {
          const ansBtn = document.createElement('button');
          ansBtn.className = 'answers';
          ansBtn.innerText = `${newArray[i]}`;
          btnsDiv.appendChild(ansBtn);
        }

        const allAns = document.querySelectorAll('.answers');
        for (let i = 0; i < ansLen; i++) {
          allAns[i].addEventListener('click', () => {
            if (val === 9) {
              while (btnsDiv.lastChild) {
                btnsDiv.removeChild(btnsDiv.lastChild);
              }
              btnsDiv.appendChild(btnStart);
              head.textContent = `あなたの正答数は${correctVal}です`;
              question.textContent =
                'もう一度チャレンジする場合は以下のボタンをクリック';
              difficult.textContent = '';
              genre.textContent = '';
              correctVal = 0;
            }
            // 正解だった場合
            if (allAns[i].textContent === quizResult[val].correct_answer) {
              correctVal++;
            }
            console.log(correctVal);
            val++;
            new Quiz({
              category: `${quizResult[val].category}`,
              difficulty: `${quizResult[val].difficulty}`,
              question: `${quizResult[val].question}`,
            });
          });
        }
      }
    }
    const quiz1 = new Quiz({
      category: `${quizResult[val].category}`,
      difficulty: `${quizResult[val].difficulty}`,
      question: `${quizResult[val].question}`,
    });

    console.log(quiz1.obj);
  }
}
