var canvas = document.getElementById("canvas");
var start = document.getElementById("start");
var button2 = document.getElementById("button2");
var wrong = document.getElementById("wrong");
var correct = document.getElementById("correct");
var time = document.getElementById("time");
var accuracy = document.getElementById("accuracy");
var input = document.getElementById('inputText');
var level = document.getElementById('level');
// var levelProgress = document.getElementById('levelProgress');
var accuracybar = document.getElementById('accuracybar');
var progressAccuracyBar = document.getElementById('progressAccuracyBar');
var game = document.getElementById('game');
var modalAccuracy = document.getElementById('modalAccuracy');
var modalLevel = document.getElementById('modalLevel');
var modal = document.getElementById('modal');
var modalHeading = document.getElementById('modalHeading');
var modalIcon = document.getElementById('modalIcon');
var stars = document.getElementById('stars');


var LEVEL = 5;
var TIMER = 30;
var SPEED = 0.6;
var POSSIBLE_MISSED = 3;

var timer = TIMER;
var value = 0;
var sound;

var ctx = canvas.getContext("2d"),
  W = canvas.width, // simplified for demo
  H = canvas.height,
  gravity = 0.001,
  bounceFactor = 0.7;



//------------- GLOBAL VARIABLE --------------------- 

var text;
var renderintervalId;
var levelIntervalId;
var levelIntervalTimerId;
var gameIntervalId;
var scoringWord = "";

var score = {
  correct: 0,
  missed: POSSIBLE_MISSED,
  totalWords: 0,
  level: 0,
  overallAccuracy: 0,
  increaseTotalWords: function () {
    this.totalWords += 1;
  },
  increaseCorrect: function () {
    this.correct += 1;
  },
  decreaseMissed: function () {
    this.missed -= 1;
  },
  getCorrect: function () {
    return this.correct;
  },
  getMissed: function () {
    return this.missed;
  },
  getAccuracy: function () {
    if (!this.totalWords) {
      return 0;
    }
    return Math.floor((this.correct / this.totalWords) * 100);
  },
  getLevelBar: function () {
    return 20 * this.level;
  },
  increaseLevel: function () {
    this.level += 1;
  },
  getLevel: function () {
    return this.level;
  },
  updateOverallAccuracy: function () {
    let currentAccuracy = this.getAccuracy();
    let previousOverallAccuracy = this.overallAccuracy;
    let level = this.level;
    if(level==0){
      this.overallAccuracy = currentAccuracy;
    }
    else{
      this.overallAccuracy = Math.floor((previousOverallAccuracy * (level - 1) + currentAccuracy) / level);
    }
  },
  getOverallAccuracy: function () {
    return this.overallAccuracy;
  },
  getOverallAccuracyBar: function () {
    return Math.floor((this.correct / this.totalWords) * 100);
  },
  reset: function () {
    this.correct = 0; this.missed = POSSIBLE_MISSED; this.totalWords = 0;
  },
  resetAll: function(){
    this.reset();
    this.level = 0;
    this.overallAccuracy = 0;
  }
}


//------------------  TEXT CLASS  ----------------//

function Text(text) {
  this.x = 220;
  this.y = 3;
  this.color = "#333";
  this.vx = 0;
  this.vy = SPEED;
  this.text = text;
}

Text.prototype = {
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "60px Comic Sans MS";
    ctx.fillText(this.text, this.x, this.y);
  },

  update: function () {
    ctx.fillStyle = "white";
    ctx.font = "60px Comic Sans MS";
    this.y += this.vy;
    // this.vy += gravity;
    ctx.fillText(this.text, this.x, this.y);
    if (this.y > H) {       // word touches the bottom.
      clearInterval(renderintervalId);
      renderintervalId = null;
      clearCanvas();
      score.decreaseMissed();
      renderScore();
      if (score.getMissed() == 0) {
        // alert("YouLost");
        clearLevel(true);
        openModal(true);
      }
    }
  },
};

function clearCanvas() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderText() {
  clearCanvas();
  text.draw();
  text.update();
}


function clearRenderInterval() {
  clearInterval(renderintervalId);
  renderintervalId = null;
  clearCanvas();
}

// RESET THE GAME (same as before start playing)
function resetGame(){

  score.resetAll();
  timer = TIMER;
  renderScore();
  time.innerHTML = `${timer} <span class='text-medium'>sec</span>`;
}

function resetScoreWithTimeRender(){
  score.reset();
  timer = TIMER;
  renderScore();
  time.innerHTML = `${timer} <span class='text-medium'>sec</span>`;
}

function clearLevel(isGameOver = false) {
  // clear timer
  clearInterval(levelIntervalTimerId);
  levelIntervalTimerId = null;
  // clear level
  clearInterval(levelIntervalId);
  levelIntervalId = null;
  // clear word's movement
  clearRenderInterval();
  input.value = "";
  if (!isGameOver) {
    score.increaseLevel();
  }
  score.updateOverallAccuracy();
  resetScoreWithTimeRender();
  // GAME END CONDITION
  if(score.getLevel()=== LEVEL){
    openModal();
  }
}


//------------------------  GAME STARTS FROM HERE ----------------------- //

start.addEventListener("click", function () {
  renderGame();
  // gameIntervalId = setInterval(renderGame);// call after every TIMER sec
});

function renderGame() {
  if(levelIntervalId){
    return ;
  }

  // START LEVEL
  renderScore();
  levelIntervalId = setInterval(startGameLevel, 10);
  // START TICK TICK
  levelIntervalTimerId = setInterval(countDown, 1000);
}


// ------ CALCULATE THE TIME -------------

function countDown() {
  //check
  if (timer > 0) {
    //decrement time
    timer--;
  } else if (timer == 0) {
    //game end for current level
    clearLevel();
  
  }
  // time display
  time.innerHTML = `${timer} <span class='text-medium'>sec</span>`;
}
//------------------------   HANDLING THE WORDS MOVEMENT ----------------------- //

function startGameLevel() {

  if (renderintervalId) {
    return;
  }
  // logic for word selection
  input.value = "";
  let word = getMeRandomWord();
  scoringWord = word;
  text = new Text(word);
  renderintervalId = setInterval(renderText, 10);
}


//------------------------   HANDLING THE TYPING OPERATION ----------------------- //

function handleInput() {
  let currentWord = input.value;
  input.value = currentWord.toUpperCase();
  console.log(currentWord);
  console.log(scoringWord);
  if (currentWord.toUpperCase() === scoringWord.toUpperCase()) {
    //  add the score
    //  clearInput
    //   clear  renderintervalId
    score.increaseCorrect();
    clearRenderInterval();
    renderScore();
  }
}


//  EXTRA METHODS
function renderScore() {
  wrong.innerHTML = score.getMissed();
  correct.innerHTML = score.getCorrect();
  accuracy.innerHTML = `${score.getAccuracy()} <span class='text-medium'>%</span>`;
  level.innerHTML = `${score.getLevel()}/${LEVEL}`;
  // levelProgress.value = score.getLevelBar();
  updateRatingStars(score.getLevel());
  accuracybar.innerHTML = score.getOverallAccuracy() + "%";
  progressAccuracyBar.value = score.getOverallAccuracy();

};
function updateRatingStars(rating){
  let filledStar = '<i class="fa fa-star md-10 icon-big fill"></i>';
  let emptyStar = '<i class="fa fa-star md-10 icon-big empty"></i>';
  let res='';
  for(let i=1; i<=LEVEL;i++){
    if(i<= rating){
      res += filledStar;
    }
    else{
      res += emptyStar;
    }
  }
  stars.innerHTML = res;
}
// render the values when page loads first time
(function(){
  renderScore();
})();

// ------------------------ RANDOM WORDS --------------------------------------------

function getMeRandomWord() {
  score.increaseTotalWords();
  let randomidx = Math.floor(Math.random() * (wordDictionary.length));   // 0 --- 75
  let word = wordDictionary[randomidx];
  return word;
};


// ----------------------SHOW MODAL ------------------------

function openModal(isGameOver = false) {
  let heading = isGameOver? "Game Over, You lost it!! 😓": "Hurrey, You Won The Game. 🥳" 
  if(isGameOver){
    modalIcon.classList.remove('fa-trophy');
    modalIcon.classList.remove('brightYellow');
    modalIcon.classList.add("fa-exclamation");
    modalIcon.classList.add("redDark");
    modal.style.backgroundColor="#ffa366";
  }else{
    modalIcon.classList.add('fa-trophy');
    modalIcon.classList.add('brightYellow');
    modalIcon.classList.remove("fa-exclamation");
    modalIcon.classList.remove("redDark");
    modal.style.backgroundColor="#ff884d";
  }
  modalLevel.innerHTML = `${score.getLevel()}/${LEVEL}`;
  modalAccuracy.innerHTML = score.getOverallAccuracy() + "%";
  modalHeading.innerHTML = heading;
  
  game.classList.add("disable");
  modal.classList.add("show");
  modal.classList.remove("hide");

};
function closeModal() {
  resetGame();
  game.classList.remove("disable");
  modal.classList.remove("show");
  modal.classList.add("hide");
}