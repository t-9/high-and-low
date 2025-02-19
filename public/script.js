// デッキ生成（1-13のカード、ジョーカーは0として特別扱い）
function createDeck() {
  const deck = [];
  for (let i = 0; i <= 13; i++) deck.push(i);
  return deck.sort(() => Math.random() - 0.5); // シャッフル
}

let deck = createDeck();
let currentCard = drawCard();
let score = 0;
let gameOver = false;

const currentCardDiv = document.getElementById("current-card");
const nextCardDiv = document.getElementById("next-card");
const scoreDiv = document.getElementById("score");
const messageDiv = document.getElementById("message");
const highBtn = document.getElementById("high-btn");
const lowBtn = document.getElementById("low-btn");
const restartBtn = document.getElementById("restart-btn");
const gameContainer = document.querySelector(".game-container");

currentCardDiv.textContent = displayCard(currentCard);

// カードを引く
function drawCard() {
  if (deck.length === 0) deck = createDeck();
  return deck.pop();
}

// カード表示用テキスト
function displayCard(card) {
  return card === 0 ? "Joker" : card;
}

// ゲームの状態更新
function updateGame(prediction) {
  if (gameOver) return;

  const nextCard = drawCard();
  nextCardDiv.textContent = displayCard(nextCard);
  nextCardDiv.classList.remove("hidden");
  nextCardDiv.classList.add("flip");

  // 正誤判定
  const isCorrect = (prediction === "high" && nextCard > currentCard) ||
                    (prediction === "low" && nextCard < currentCard) ||
                    (nextCard === 0 || currentCard === 0); // ジョーカーは常に正解

  setTimeout(() => {
      if (isCorrect) {
          score++;
          scoreDiv.textContent = `スコア: ${score}`;
          messageDiv.textContent = "正解！";
          currentCardDiv.style.opacity = "0"; // 古いカードをフェードアウト
          setTimeout(() => {
              currentCard = nextCard;
              currentCardDiv.textContent = displayCard(currentCard);
              currentCardDiv.style.opacity = "1"; // 新しいカードをフェードイン
          }, 300);
      } else {
          gameOver = true;
          messageDiv.textContent = `ゲームオーバー！最終スコア: ${score} - ${getTitle(score)}`;
          gameContainer.classList.add("game-over"); // ゲームオーバーアニメーション
          highBtn.classList.add("hidden");
          lowBtn.classList.add("hidden");
          restartBtn.classList.remove("hidden");
      }
      nextCardDiv.classList.add("hidden");
      nextCardDiv.classList.remove("flip");
  }, 1000); // アニメーション後に結果表示
}

// 称号システム
function getTitle(score) {
  if (score >= 20) return "カードマスター";
  if (score >= 10) return "ハイローの達人";
  if (score >= 5) return "中級者";
  return "初心者";
}

// ボタンイベント
highBtn.addEventListener("click", () => updateGame("high"));
lowBtn.addEventListener("click", () => updateGame("low"));
restartBtn.addEventListener("click", () => {
  deck = createDeck();
  currentCard = drawCard();
  score = 0;
  gameOver = false;
  currentCardDiv.textContent = displayCard(currentCard);
  scoreDiv.textContent = "スコア: 0";
  messageDiv.textContent = "";
  highBtn.classList.remove("hidden");
  lowBtn.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  gameContainer.classList.remove("game-over"); // アニメーションリセット
  gameContainer.style.opacity = "1"; // 透明度リセット
});