/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
      "UP": 38,   //up arrow key
      "DOWN": 40, //down arrow key
      "W": 87,    //up
      "S": 83,    //down
  }; //Keys have hard-coded values -> eliminates magic numbers

  // Game Item Objects -- called from gameObjInfo factory function (#id, x, y, speedX, speedY)

  //LEFT PADDLE
  var player1 = gameObjInfo("#left_paddle", 0, 167, 0, 0);

  //RIGHT PADDLE
  var player2 = gameObjInfo("#right_paddle", 415, 167, 0, 0);

  //BALL - gives random speed immediately so that the game can start immediately
  var ball = gameObjInfo("#ball", 0, 0, (Math.random() * 4), (Math.random() * 4));

  //SCOREBOARDS
  var scoreP1 = gameObjInfo("#scoreP1", 0, 0, 0, 0);
  var scoreP2 = gameObjInfo("#scoreP2", 0, 0, 0, 0);

  //BOARD INFORMATION -- used so that the paddle and balls do not go out of the board
  var boardWidth = $("#board").width();
  var boardHeight = $("#board").height();
  var player1Height = $("#left_paddle").height();
  var player2Height = $("#right_paddle").height();

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on("keydown", handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on("keyup", handleKeyUp);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */

  //Updates game objects every frame
  function newFrame() {
    //PLAYER 1 PADDLE
    repositionPaddle1();
      //prevents player 1's paddle from flying off screen by forcing the paddle to bounce back gently
      //only fixes vertical position since the paddle does not need to move left to right
      if (player1.y > boardHeight - player1Height) {
          player1.speedY = player1.speedY * -1;
      } else if (player1.y < 0) {
          player1.speedY = player1.speedY * -1;
      }

    //redraws player 1's paddle using CSS after finding the new position
    redrawPaddle1();

    //PLAYER 2 PADDLE
    repositionPaddle2();
      //prevents player 2's paddle from flying off screen by forcing the paddle to bounce back gently
      //only fixes vertical position since the paddle does not need to move left to right
      if (player2.y > boardHeight - player1Height) {
          player2.speedY = player2.speedY * -1;
      } else if (player2.y < 0) {
          player2.speedY = player2.speedY * -1;
      }

    //redraws player 2's paddle using CSS after finding the new position
    redrawPaddle2();

    //BALL
    repositionBall();
      //prevents ball from flying off screen by forcing ball to buonce off walls
      //ball needs to update both x-position and y-position in order to reach both paddles in gameplay
      if (ball.x > boardWidth - 35) {
          ball.speedX = ball.speedX * -1;
      } else if (ball.x < 0) {
          ball.speedX = ball.speedX * -1;
      }
      if (ball.y > boardWidth - 35) {
          ball.speedY = ball.speedY * -1;
      } else if (ball.y < 0) {
          ball.speedY = ball.speedY * -1;
      }
    //redraws ball using CSS after finding the new position
    redrawBall();
  }
  
  /* 
  Called in response to events.
  */

  //When a certain key is pressed, the correct paddle moves accordingly
  function handleKeyDown(event) {
    //CONTROLS FOR PLAYER 1
    if (event.which === KEY.W) {
        player1.speedY = -3;
    } else if (event.which === KEY.S) {
        player1.speedY = 3;
    }
    //CONTROLS FOR PLAYER 2
    if (event.which === KEY.UP) {
        player2.speedY = -3;
    } else if (event.which === KEY.DOWN) {
        player2.speedY = 3;
    }
  }

  //When a key is lifted, the paddle stops moving
  function handleKeyUp(event) {
    //PLAYER 1
    player1.speedX = 0;
    player1.speedY = 0;
    //PLAYER 2
    player2.speedX = 0;
    player2.speedY = 0;
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  //Factory function called to make each necessary game object variable
  function gameObjInfo(id, x, y, speedX, speedY){
    var object = {
       "id": id,
       "x": x,
       "y": y,
       "speedX": speedX,
       "speedY": speedY
    }
    return object;
  }
  
  //PLAYER 1 REPOSITIONING AND DRAWING
  function repositionPaddle1() {
    //vertical position of player 1 updates
     player1.y += player1.speedY;
  } 
  //Redraws player 1's paddle in new position using the new x and y
  function redrawPaddle1() {
    //draws left paddle in new position using player1.y as a new reference point
     $("#left_paddle").css("top", player1.y);
  }

  //PLAYER 2 REPOSITIONING AND REDRAWING
  function repositionPaddle2() {
    //vertical position of player 2 updates
     player2.y += player2.speedY;
  }
  //Redraws player 2's paddle in new position using the new x and y 
  function redrawPaddle2() {
    //draws right paddle in new position using player2.y as a new reference point
     $("#right_paddle").css("top", player2.y);
  }

  //BALL REPOSITIONING AND REDRAWING
  function repositionBall() {
    //ball needs to move both horizontally AND vertically in order to reach both paddles
      ball.x += ball.speedX;

    //repositions ball vertically
      ball.y += ball.speedY;
  }
    //Redraws ball in new position using updates x and y positions
  function redrawBall() {
    //draws ball in new position using ball.x and ball.y as a new reference points
    $("#ball").css("left", ball.x);
    $("#ball").css("top", ball.y);
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
