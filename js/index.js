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


var timer = 20;
var SPEED = 0.3;
var value = 0;

var ctx = canvas.getContext("2d"),
  W = canvas.width, // simplified for demo
  H = canvas.height,
  gravity = 0.001,
  bounceFactor = 0.7;



//------------- Globalvariables --------------------- 

var ball;
var renderintervalId;
var levelIntervalId;
var levelIntervalTimerId;

var scoringWord="";

var score = {
  correct:0,
  missed:0,
  totalWords:0,
  level:0,
  overAllAccuracy: 0,

  
  increaseTotalWords: function(){
    this.totalWords += 1;
  },
  increaseCorrect: function(){
    this.correct += 1;
  },
  increaseMissed: function(){
    this.missed += 1;
  },
  getCorrect: function(){
    return this.correct;
  },
  getMissed: function() {
    return this.missed;
  },
  getAccuracy:function(){
    if(!this.totalWords){
      return 0+"%";
    }
    return Math.floor((this.correct/this.totalWords)*100) + "%";
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
  getOverallAccuracy:function(){
    if(!this.totalWords){
      return 0+"%";
    }
    return Math.floor((this.correct/this.totalWords)*100) + "%";
  },

  getOverallAccuracyBar: function(){
    return 
  },
  // ------------------------end--------------------------
  reset: function(){
    this.correct = 0; this.missed = 0; this.totalWords = 0;
  }
}


//------------------  BALL/TEXT CLASS  ----------------//

function Ball(text) {
  this.x = 220;
  this.y = 3;
  this.color = "#333";
  this.vx = 0;
  this.vy = SPEED;
  this.text = text;
}

Ball.prototype = {
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.strokeText(this.text, this.x, this.y);
  },

  update: function () {
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    this.y += this.vy;
    // this.vy += gravity;
    ctx.strokeText(this.text, this.x, this.y);
    if (this.y > H) {
      clearInterval(renderintervalId);
      renderintervalId = null;
      clearCanvas();
      score.increaseMissed();
      renderScore();
    }
  },
};

function clearCanvas() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderBall() {
  clearCanvas();
  ball.draw();
  ball.update();
}


function clearRenderInterval(){
  clearInterval(renderintervalId);
  renderintervalId = null;
  clearCanvas();
}

function clearLevel(){
  clearInterval(levelIntervalId);
  levelIntervalId = null;
  clearRenderInterval();
  input.value = "";
  score.reset();
  score.increaseLevel();
  renderScore();
}


//------------------------  GAME STARTS FROM HERE ----------------------- //

start.addEventListener("click", function () {

  // START LEVEL
  levelIntervalId = setInterval(startGameLevel,10);  

  // START TICK TICK
   levelIntervalTimerId = setInterval(countDown,1000);

});

// --- calulate the time ---

function countDown(){
  //check
  if(timer > 0){
    //decrement time
    timer --;
  } else if(timer == 0){
    //game end for current level
    clearLevel();
    clearInterval(levelIntervalTimerId);
    
   }
   // time display
   time.innerHTML = timer;
}
//------------------------   HANDLING THE WORDS MOVEMENT ----------------------- //

function startGameLevel() {

  if (renderintervalId) {
    return;
  }
  // logic for word selection
  let word = getMeRandomWord();
  scoringWord = word
  ball = new Ball(word);
  renderintervalId = setInterval(renderBall, 10);
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
  accuracy.innerHTML = score.getAccuracy();
  level.innerHTML = score.getLevel();
  levelProgress.value = score.getLevelBar();
  // -----------------------------------start-----------------------------------
  accuracybar.innerHTML = score.getOverallAccuracy();
  progressAccuracyBar.innerHTML = score.getOverallAccuracyBar();
 
  // ----------------------------------end----------------------------------------
};



// ------------------------ random words --------------------------------------------

function getMeRandomWord(){
  score.increaseTotalWords();
  let randomidx = Math.floor(Math.random() * (wordDictionary.length));   // 0 --- 75
  let word = wordDictionary[randomidx];
  return word;
}




