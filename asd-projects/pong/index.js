/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  //Factory function called to make each necessary game object variable
  function gameObjInfo($id){
    var object = {}
       object.id = $id;
       object.x = parseFloat($($id).css("left"));
       object.y = parseFloat($($id).css("top"));
       object.speedX = 0;
       object.speedY = 0;
       object.height = $($id).height();
       object.width = $($id).width();
    return object;
  }

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
      "UP": 38,   //up arrow key
      "DOWN": 40, //down arrow key
      "W": 87,    //up
      "S": 83,    //down
  }; //Keys have hard-coded values -> eliminates magic numbers

  // Game Item Objects -- called from gameObjInfo factory function and uses CSS positions to determine x and y

  //LEFT PADDLE 
  var player1 = gameObjInfo("#left_paddle");

  //RIGHT PADDLE
  var player2 = gameObjInfo("#right_paddle");

  //BALL
  var ball = gameObjInfo("#ball");
  var ballStartX = 199;
  var ballStartY = 205;

  //SCOREBOARDS
  var scoreP1 = gameObjInfo("#scoreP1");
  var scoreP2 = gameObjInfo("#scoreP2");

  //BOARD -- used so that the paddle and balls do not go out of the board
  var board = gameObjInfo("#board");

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on("keydown", handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on("keyup", handleKeyUp);
  $(document).on("click", handleOnClick);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */

  //Updates game objects every frame
  function newFrame() {
    //repositions paddles and balls every frame
    repositionObjects();

      //prevents player 1's paddle from flying off screen by forcing the paddle to bounce back gently
      //only fixes vertical position since the paddle does not need to move left to right
      if (player1.y > board.height - player1.height) {
          player1.speedY = player1.speedY * -1;
      } else if (player1.y < 0) {
          player1.speedY = player1.speedY * -1;
      }

      //prevents player 2's paddle from flying off screen by forcing the paddle to bounce back gently
      //only fixes vertical position since the paddle does not need to move left to right
      if (player2.y > board.height - player2.height) {
          player2.speedY = player2.speedY * -1;
      } else if (player2.y < 0) {
          player2.speedY = player2.speedY * -1;
      }

      //prevents ball from flying off screen by forcing ball to buonce off walls
      //ball needs to update both x-position and y-position in order to reach both paddles in gameplay
      if (ball.x > board.width - ball.width) {
          ball.speedX = ball.speedX * -1;
      } else if (ball.x < 0) {
          ball.speedX = ball.speedX * -1;
      }
      if (ball.y > board.width - ball.height) {
          ball.speedY = ball.speedY * -1;
      } else if (ball.y < 0) {
          ball.speedY = ball.speedY * -1;
      }

    //redraws players' paddles and ball using CSS after finding the new position
    redrawObjects();

    //detects collisions
    if (doCollide(ball, player1)) {
      ball.speedX = ball.speedX * -1;
    }
    
    if (doCollide(ball, player2)) {
      ball.speedX = ball.speedX * -1
    }

    //resets ball's position if ball hits the sides
    resetBallAndScore();

  }
  
  /* 
  Called in response to events.
  */

  //When the player clicks, the ball moves randomly
  function handleOnClick(event) {
    moveBall();      
  }

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

  //Controls ball movement
  //If the random number is even, then the ball will move in the negative direction. If it's odd, it moves in the positive direction.
  function moveBall() {
      //horizontal direction
    var directionX = ballDirection(2);
    if ((directionX % 2) > 0) {
        ball.speedX = 3;
    } else if ((directionX % 2) === 0) {
        ball.speedX = -3;
    }
      //vertical direction
    var directionY = ballDirection(2);
    if ((directionY % 2) > 0) {
        ball.speedY = 3;
    } else if ((directionY % 2) === 0) {
        ball.speedY = -3;
    }
  }

  //Detects when the ball collides with paddle
  function doCollide(square1, bouncingObj) {
    // PADDLE INFO
    square1.leftX = square1.x;
    square1.topY = square1.y;
    square1.rightX = square1.x + square1.width;
    square1.bottomY = square1.y + square1.height;
  
    // BALL INFO
    bouncingObj.leftX = bouncingObj.x;
    bouncingObj.topY = bouncingObj.y;
    bouncingObj.rightX = bouncingObj.x + bouncingObj.width;
    bouncingObj.bottomY = bouncingObj.y + bouncingObj.height;
  
	if (bouncingObj.rightX > square1.leftX && 
        bouncingObj.leftX < square1.rightX && 
        bouncingObj.bottomY > square1.topY && 
        bouncingObj.topY < square1.bottomY) {
        return true;
    } else {
        return false;
    }
  }

  //Resets ball to starting position and updates score if a paddle misses
  function resetBallAndScore() {
    var ballRightX = ball.x + ball.width;
    var pointsP1 = 0;
    var pointsP2 = 0;
    //if the ball hits the left side (as opposed to colliding with the paddle), the ball resets
    if (ball.x < 0) {
        ball.speedX = 0;
        ball.speedY = 0;
        ball.x = ballStartX;
        ball.y = ballStartY;
        pointsP2 = pointsP2 + 1;
        console.log("Player 2 Score: " + pointsP2);
    }
    //if the ball hits the right of the board (as opposed to colliding with the paddle), the ball resets
    else if (ballRightX >= board.width) {
        ball.speedX = 0;
        ball.speedY = 0;
        ball.x = ballStartX;
        ball.y = ballStartY;
        pointsP1 = pointsP1 + 1;
        console.log("Player 1 Score: " + pointsP1);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  //REPOSITIONING AND DRAWING
  function repositionObjects() {
    //vertical position of players and ball update
     player1.y += player1.speedY;
     player2.y += player2.speedY;
     ball.x += ball.speedX;
     ball.y += ball.speedY;
  } 

  //Redraws players' paddles and ball in new position using the new x and y
  function redrawObjects() {
    //draws paddles in new position using .x and .y as a new reference points
     $("#left_paddle").css("top", player1.y);
     $("#right_paddle").css("top", player2.y);
     $("#ball").css("left", ball.x);
     $("#ball").css("top", ball.y);
  }

  //Determines random number for moveBall function
  function ballDirection(num) {
    var direction = Math.ceil(Math.random() * num);
    return direction;
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}