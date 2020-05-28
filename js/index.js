var canvas = document.getElementById("canvas");
var start = document.getElementById("start");
var button2 = document.getElementById("button2");
var wrong = document.getElementById("wrong");
var correct = document.getElementById("correct");
var time = document.getElementById("time");
var accuracy = document.getElementById("accuracy");
var input = document.getElementById('inputText');
var level = document.getElementById('level');
var levelProgress = document.getElementById('levelProgress');
var accuracybar = document.getElementById('accuracybar');
var progressAccuracyBar = document.getElementById('progressAccuracyBar');

var TIMER = 60;
var timer = TIMER;
var SPEED = 0.3;
var POSSIBLE_MISSED = 3;
var value = 0;
var sound;

var ctx = canvas.getContext("2d"),
  W = canvas.width, // simplified for demo
  H = canvas.height,
  gravity = 0.001,
  bounceFactor = 0.7;



//------------- Globalvariables --------------------- 

var text;
var renderintervalId;
var levelIntervalId;
var levelIntervalTimerId;

var scoringWord="";

var score = {
  correct:0,
  missed:POSSIBLE_MISSED,
  totalWords:0,
  level:0,
  overallAccuracy:0,
  increaseTotalWords: function(){
    this.totalWords += 1;
  },
  increaseCorrect: function(){
    this.correct += 1;
  },
  decreaseMissed: function(){
    this.missed -= 1;
  },
  getCorrect: function(){
    return this.correct;
  },
  getMissed: function() {
    return this.missed;
  },
  getAccuracy:function(){
    if(!this.totalWords){
      return 0;
    }
    return Math.floor((this.correct/this.totalWords)*100);
  },
  getLevelBar: function(){
    return 20*this.level;
  },
  increaseLevel: function(){
    this.level +=1;
  },
  getLevel: function(){
      return this.level + "/5";
  },
  // ---------------------------start---------------------
  updateOverallAccuracy: function(){
    let currentAccuracy = this.getAccuracy();
    let previousOverallAccuracy = this.overallAccuracy;
    let level = this.level;
    this.overallAccuracy = (Math.floor(previousOverallAccuracy*(level-1)+currentAccuracy)/level);
  },
  getOverallAccuracy:function(){
    return this.overallAccuracy;
  },

  getOverallAccuracyBar: function(){
    return Math.floor((this.correct/this.totalWords)*100);
  },
  // ------------------------end--------------------------
  reset: function(){
    this.correct = 0; this.missed = POSSIBLE_MISSED; this.totalWords = 0;
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
      if(score.getMissed()==0){    
        // alert("YouLost");
        clearLevel(true);
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


function clearRenderInterval(){
  clearInterval(renderintervalId);
  renderintervalId = null;
  clearCanvas();
}

function clearLevel(isGameOver = false){
  // clear timer
  clearInterval(levelIntervalTimerId);
  levelIntervalTimerId = null;
  // clear level
  clearInterval(levelIntervalId);
  levelIntervalId = null;
  // clear word's movement
  clearRenderInterval();
  input.value = "";
  if(!isGameOver){
    score.increaseLevel();
    score.updateOverallAccuracy();
  }
  score.reset();
  timer=TIMER;
  renderScore();
}


//------------------------  GAME STARTS FROM HERE ----------------------- //

start.addEventListener("click", function () {
  renderGame();
});

function renderGame(){
  // START LEVEL
  renderScore();
  levelIntervalId = setInterval(startGameLevel,10);  
  // START TICK TICK
   levelIntervalTimerId = setInterval(countDown,1000);
}


// --- calulate the time ---

function countDown(){
  //check
  if(timer > 0){
    //decrement time
    timer --;
  } else if(timer == 0){
    //game end for current level
    clearLevel();
    
   }
   // time display
   time.innerHTML = `${timer} <span class='text-medium'>sec</span>`;
  //  list.insertBefore(newItem, list.childNodes[0]);
  // time.insertBefore(timer, time.childNodes[2] );
}
//------------------------   HANDLING THE WORDS MOVEMENT ----------------------- //

function startGameLevel() {

  if (renderintervalId) {
    return;
  }
  // logic for word selection
  let word = getMeRandomWord();
  scoringWord = word
  text = new Text(word);
  renderintervalId = setInterval(renderText, 10);
}


//------------------------   HANDLING THE TYPING OPERATION ----------------------- //

function handleInput(){
  let currentWord = input.value;
  input.value = currentWord.toUpperCase();
  console.log(currentWord);
  console.log(scoringWord);
  if(currentWord.toUpperCase()===scoringWord.toUpperCase()){
    //  add the score
    //  clearInput
    //   clear  renderintervalId
    score.increaseCorrect();
    input.value="";
    clearRenderInterval();
    renderScore();
  }
}


//  EXTRA METHODS
function renderScore(){
  wrong.innerHTML = score.getMissed();
  correct.innerHTML = score.getCorrect();
  accuracy.innerHTML = `${score.getAccuracy()} <span class='text-medium'>%</span>`;
  level.innerHTML = score.getLevel();
  levelProgress.value = score.getLevelBar();
  accuracybar.innerHTML = score.getOverallAccuracy()+"%";
  progressAccuracyBar.value = score.getOverallAccuracy();
 
};

// ------------------------ random words --------------------------------------------

function getMeRandomWord(){
  score.increaseTotalWords();
  let randomidx = Math.floor(Math.random() * (wordDictionary.length));   // 0 --- 75
  let word = wordDictionary[randomidx];
  return word;
}




